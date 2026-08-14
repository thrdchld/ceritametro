/**
 * Main Application Controller & State Manager
 */

import { renderHeader, renderLoading, renderAlert } from './components.js';
import {
  renderHomeView,
  renderMode1InputView,
  renderOutlineChoicesView,
  renderWizardStageView,
  renderWizardReviewView,
  renderImproveOutlineView,
  renderStoryResultView,
  renderSettingsView,
  renderHistoryView,
  renderWritingBrainView
} from './views.js';

import { getSettings, saveSettings } from '../core/storage.js';
import { loadHistory, saveStory, deleteStory, getStoryById } from '../core/history.js';
import { generateOutlineOptions, generateFinalStoryFromOutline } from '../core/story-engine.js';
import {
  WIZARD_STAGES,
  generateInitialPremises,
  generateWizardStageChoices,
  generateOutlineReview,
  improveOutline
} from '../core/wizard-engine.js';
import { generateImagePrompt, generateStoryImage } from '../core/image-engine.js';
import { fetchAvailableModels } from '../core/ai-client.js';
import { copyToClipboard } from '../utils/clipboard.js';
import { exportHistoryJSON, importHistoryJSON, exportStoryMarkdown } from '../utils/export.js';

class AppController {
  constructor() {
    this.currentView = 'home';
    this.state = {
      userIdea: '',
      theme: 'Bebas',
      outlineOptions: [],
      selectedOutline: null,
      wizardStageIndex: 0,
      wizardSelections: {},
      wizardChoicesCurrentStage: [],
      wizardWhyItWorks: '',
      improvedOutlineData: null,
      currentStory: null,
      historyList: [],
      scannedTextModels: [],
      scannedImageModels: [],
      alert: null
    };
  }

  init() {
    this.bindGlobalEvents();
    this.render();
  }

  showAlert(message, type = 'info') {
    this.state.alert = { message, type };
    this.render();
    setTimeout(() => {
      this.state.alert = null;
      this.render();
    }, 4000);
  }

  setLoading(message) {
    const container = document.getElementById('app-content');
    if (container) {
      container.innerHTML = renderLoading(message);
    }
  }

  updateLoadingStatus(message) {
    const el = document.getElementById('loading-status-text');
    if (el) el.textContent = message;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Global Event Delegation ---

  bindGlobalEvents() {
    document.addEventListener('click', (e) => {
      const routeTarget = e.target.closest('[data-route]');
      if (routeTarget) {
        e.preventDefault();
        const route = routeTarget.dataset.route;
        this.navigate(route);
        return;
      }

      const actionTarget = e.target.closest('[data-action]');
      if (actionTarget) {
        e.preventDefault();
        const action = actionTarget.dataset.action;
        this.handleAction(action, actionTarget);
      }
    });
  }

  navigate(viewName) {
    this.currentView = viewName;
    if (viewName === 'history') {
      this.state.historyList = loadHistory();
    }
    this.render();
    this.scrollToTop();
  }

  handleAction(action, target) {
    if (action === 'start-mode-1') {
      this.currentView = 'mode1-input';
      this.render();
    } else if (action === 'start-mode-2') {
      this.executeMode2();
    } else if (action === 'start-mode-3') {
      this.executeMode3();
    }
  }

  // --- Rendering ---

  render() {
    const root = document.getElementById('app');
    if (!root) return;

    let contentHtml = '';

    if (this.currentView === 'home') {
      contentHtml = renderHomeView();
    } else if (this.currentView === 'mode1-input') {
      contentHtml = renderMode1InputView();
    } else if (this.currentView === 'outline-choices') {
      contentHtml = renderOutlineChoicesView(this.state.outlineOptions);
    } else if (this.currentView === 'wizard-stage') {
      contentHtml = renderWizardStageView({
        stageIndex: this.state.wizardStageIndex,
        totalStages: WIZARD_STAGES.length,
        stageInfo: WIZARD_STAGES[this.state.wizardStageIndex],
        choices: this.state.wizardChoicesCurrentStage,
        selections: this.state.wizardSelections
      });
    } else if (this.currentView === 'wizard-review') {
      contentHtml = renderWizardReviewView({
        wizardData: this.state.wizardSelections,
        whyItWorks: this.state.wizardWhyItWorks
      });
    } else if (this.currentView === 'improve-outline') {
      contentHtml = renderImproveOutlineView({
        currentOutline: this.state.wizardSelections,
        improvedOutline: this.state.improvedOutlineData.improvedOutline,
        improvementReason: this.state.improvedOutlineData.improvementReason
      });
    } else if (this.currentView === 'story-result') {
      contentHtml = renderStoryResultView(this.state.currentStory);
    } else if (this.currentView === 'settings') {
      contentHtml = renderSettingsView(getSettings(), this.state.scannedTextModels, this.state.scannedImageModels);
    } else if (this.currentView === 'history') {
      contentHtml = renderHistoryView(this.state.historyList);
    } else if (this.currentView === 'brain') {
      contentHtml = renderWritingBrainView();
    }

    root.innerHTML = `
      ${renderHeader({ activeView: this.currentView })}
      <main class="app-main">
        ${this.state.alert ? renderAlert(this.state.alert.message, this.state.alert.type) : ''}
        <div id="app-content">${contentHtml}</div>
      </main>
    `;

    this.bindViewEvents();
  }

  // --- View-Specific Event Bindings ---

  bindViewEvents() {
    this.bindMode1Events();
    this.bindOutlineEvents();
    this.bindWizardEvents();
    this.bindStoryResultEvents();
    this.bindSettingsEvents();
    this.bindHistoryEvents();
  }

  bindMode1Events() {
    const btnMode1Options = document.getElementById('btn-mode1-5options');
    if (btnMode1Options) {
      btnMode1Options.addEventListener('click', () => {
        const idea = document.getElementById('mode1-user-idea').value;
        const theme = document.getElementById('mode1-theme').value;
        this.executeMode1A(idea, theme);
      });
    }

    const btnMode1Wizard = document.getElementById('btn-mode1-wizard');
    if (btnMode1Wizard) {
      btnMode1Wizard.addEventListener('click', () => {
        const idea = document.getElementById('mode1-user-idea').value;
        const theme = document.getElementById('mode1-theme').value;
        this.state.wizardSelections = { premise: idea, theme };
        this.startWizardStage(0);
      });
    }
  }

  bindOutlineEvents() {
    const outlineBtns = document.querySelectorAll('.btn-select-outline');
    outlineBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        const selected = this.state.outlineOptions[idx];
        this.generateFinalStory(selected);
      });
    });
  }

  bindWizardEvents() {
    // Wizard stage choice selection
    const choiceItems = document.querySelectorAll('.wizard-choice-item');
    choiceItems.forEach(item => {
      item.addEventListener('click', () => {
        const choiceIdx = parseInt(item.dataset.choiceIndex, 10);
        const selectedChoice = this.state.wizardChoicesCurrentStage[choiceIdx];
        const stage = WIZARD_STAGES[this.state.wizardStageIndex];
        
        this.state.wizardSelections[stage.key] = selectedChoice.detail || selectedChoice.label;
        if (stage.key === 'premise') {
          this.state.wizardSelections.title = selectedChoice.label;
        }

        if (this.state.wizardStageIndex < WIZARD_STAGES.length - 1) {
          this.startWizardStage(this.state.wizardStageIndex + 1);
        } else {
          this.finishWizardToReview();
        }
      });
    });

    const btnWizardPrev = document.getElementById('btn-wizard-prev');
    if (btnWizardPrev) {
      btnWizardPrev.addEventListener('click', () => {
        if (this.state.wizardStageIndex > 0) {
          this.startWizardStage(this.state.wizardStageIndex - 1);
        }
      });
    }

    // Wizard review buttons
    const btnGenerateWizardFinal = document.getElementById('btn-generate-wizard-final');
    if (btnGenerateWizardFinal) {
      btnGenerateWizardFinal.addEventListener('click', () => {
        this.generateFinalStory(this.state.wizardSelections);
      });
    }

    const btnImproveWizardOutline = document.getElementById('btn-improve-wizard-outline');
    if (btnImproveWizardOutline) {
      btnImproveWizardOutline.addEventListener('click', async () => {
        this.setLoading('Merancang perbaikan alur cerita...');
        try {
          const res = await improveOutline(this.state.wizardSelections);
          this.state.improvedOutlineData = res;
          this.currentView = 'improve-outline';
          this.render();
        } catch (err) {
          this.showAlert('Gagal memperbaiki alur: ' + err.message, 'error');
        }
      });
    }

    // Improve outline buttons
    const btnUseImproved = document.getElementById('btn-use-improved-outline');
    if (btnUseImproved) {
      btnUseImproved.addEventListener('click', () => {
        this.state.wizardSelections = { ...this.state.wizardSelections, ...this.state.improvedOutlineData.improvedOutline };
        this.finishWizardToReview();
      });
    }

    const btnKeepCurrent = document.getElementById('btn-keep-current-outline');
    if (btnKeepCurrent) {
      btnKeepCurrent.addEventListener('click', () => {
        this.finishWizardToReview();
      });
    }
  }

  bindStoryResultEvents() {
    const btnCopyStory = document.getElementById('btn-copy-story');
    if (btnCopyStory) {
      btnCopyStory.addEventListener('click', async () => {
        const fullText = `${this.state.currentStory.title}\n\n${this.state.currentStory.story}`;
        const ok = await copyToClipboard(fullText);
        if (ok) this.showAlert('Cerita berhasil dicopy ke clipboard!', 'success');
        else this.showAlert('Gagal copy teks.', 'error');
      });
    }

    const btnExportMd = document.getElementById('btn-export-story-md');
    if (btnExportMd) {
      btnExportMd.addEventListener('click', () => {
        exportStoryMarkdown(this.state.currentStory);
      });
    }

    const btnCopyPrompt = document.getElementById('btn-copy-image-prompt');
    if (btnCopyPrompt) {
      btnCopyPrompt.addEventListener('click', async () => {
        const prompt = document.getElementById('image-prompt-textarea').value;
        const ok = await copyToClipboard(prompt);
        if (ok) this.showAlert('Prompt gambar berhasil dicopy!', 'success');
      });
    }

    const btnGenImageNow = document.getElementById('btn-generate-image-now');
    if (btnGenImageNow) {
      btnGenImageNow.addEventListener('click', () => {
        const prompt = document.getElementById('image-prompt-textarea').value;
        this.generateImage(prompt);
      });
    }

    const btnRegenImage = document.getElementById('btn-regenerate-image');
    if (btnRegenImage) {
      btnRegenImage.addEventListener('click', () => {
        const prompt = document.getElementById('image-prompt-textarea').value;
        this.generateImage(prompt);
      });
    }

    // Title format select handlers
    this.bindTitleFormatEvents();
  }

  bindTitleFormatEvents() {
    const fontSel = document.getElementById('title-font-select');
    const weightSel = document.getElementById('title-weight-select');
    const styleSel = document.getElementById('title-style-select');
    const titleDisplay = document.getElementById('story-title-render');

    if (fontSel && titleDisplay) {
      fontSel.addEventListener('change', (e) => {
        titleDisplay.classList.toggle('title-serif', e.target.value === 'serif');
        titleDisplay.classList.toggle('title-sans', e.target.value === 'sans');
      });
    }
    if (weightSel && titleDisplay) {
      weightSel.addEventListener('change', (e) => {
        titleDisplay.classList.toggle('title-bold', e.target.value === 'bold');
        titleDisplay.classList.toggle('title-normal', e.target.value === 'normal');
      });
    }
    if (styleSel && titleDisplay) {
      styleSel.addEventListener('change', (e) => {
        titleDisplay.classList.toggle('title-italic', e.target.value === 'italic');
      });
    }
  }

  bindSettingsEvents() {
    // Settings form submit
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
          endpoint: document.getElementById('setting-endpoint').value.trim(),
          apiKey: document.getElementById('setting-apiKey').value.trim(),
          model: document.getElementById('setting-model').value.trim(),
          imageEndpoint: document.getElementById('setting-imageEndpoint').value.trim(),
          imageApiKey: document.getElementById('setting-imageApiKey').value.trim(),
          imageModel: document.getElementById('setting-imageModel').value.trim()
        };
        saveSettings(updated);
        this.showAlert('Pengaturan berhasil disimpan!', 'success');
      });
    }

    // Model chip click handlers — clicking a chip selects that model
    const modelChips = document.querySelectorAll('.model-chip');
    modelChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const modelName = chip.dataset.model;
        const targetId = chip.dataset.target;
        const input = document.getElementById(targetId);
        if (input) {
          input.value = modelName;
          // Update active state visually
          const container = chip.closest('.model-chips');
          if (container) {
            container.querySelectorAll('.model-chip').forEach(c => c.classList.remove('model-chip-active'));
          }
          chip.classList.add('model-chip-active');
        }
      });
    });

    // Scan text models
    const btnScanText = document.getElementById('btn-scan-text-models');
    if (btnScanText) {
      btnScanText.addEventListener('click', async () => {
        const endpoint = document.getElementById('setting-endpoint').value;
        const apiKey = document.getElementById('setting-apiKey').value;
        btnScanText.disabled = true;
        btnScanText.textContent = '⏳ Memindai...';
        try {
          const models = await fetchAvailableModels({ endpoint, apiKey });
          this.state.scannedTextModels = models;
          // Save current form values before re-render
          const currentSettings = {
            endpoint: document.getElementById('setting-endpoint').value,
            apiKey: document.getElementById('setting-apiKey').value,
            model: document.getElementById('setting-model').value,
            imageEndpoint: document.getElementById('setting-imageEndpoint').value,
            imageApiKey: document.getElementById('setting-imageApiKey').value,
            imageModel: document.getElementById('setting-imageModel').value
          };
          saveSettings(currentSettings);
          this.currentView = 'settings';
          this.render();
          this.showAlert(`✅ Ditemukan ${models.length} model text! Klik model di bawah atau ketik nama model.`, 'success');
        } catch (err) {
          this.showAlert(err.message, 'error');
          btnScanText.disabled = false;
          btnScanText.textContent = '🔍 Pindai';
        }
      });
    }

    // Scan image models
    const btnScanImage = document.getElementById('btn-scan-image-models');
    if (btnScanImage) {
      btnScanImage.addEventListener('click', async () => {
        const endpoint = document.getElementById('setting-imageEndpoint').value;
        const apiKey = document.getElementById('setting-imageApiKey').value || document.getElementById('setting-apiKey').value;
        btnScanImage.disabled = true;
        btnScanImage.textContent = '⏳ Memindai...';
        try {
          const models = await fetchAvailableModels({ endpoint, apiKey });
          this.state.scannedImageModels = models;
          // Save current form values before re-render
          const currentSettings = {
            endpoint: document.getElementById('setting-endpoint').value,
            apiKey: document.getElementById('setting-apiKey').value,
            model: document.getElementById('setting-model').value,
            imageEndpoint: document.getElementById('setting-imageEndpoint').value,
            imageApiKey: document.getElementById('setting-imageApiKey').value,
            imageModel: document.getElementById('setting-imageModel').value
          };
          saveSettings(currentSettings);
          this.currentView = 'settings';
          this.render();
          this.showAlert(`✅ Ditemukan ${models.length} model gambar! Klik model di bawah atau ketik nama model.`, 'success');
        } catch (err) {
          this.showAlert(err.message, 'error');
          btnScanImage.disabled = false;
          btnScanImage.textContent = '🔍 Pindai';
        }
      });
    }
  }

  bindHistoryEvents() {
    const openHistoryBtns = document.querySelectorAll('.btn-open-history');
    openHistoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = getStoryById(id);
        if (item) {
          this.state.currentStory = item;
          this.currentView = 'story-result';
          this.render();
          this.scrollToTop();
        }
      });
    });

    const deleteHistoryBtns = document.querySelectorAll('.btn-delete-history');
    deleteHistoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm('Hapus cerita ini dari riwayat?')) {
          this.state.historyList = deleteStory(id);
          this.render();
          this.showAlert('Cerita berhasil dihapus.', 'info');
        }
      });
    });

    const copyHistoryBtns = document.querySelectorAll('.btn-copy-history');
    copyHistoryBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const item = getStoryById(id);
        if (item) {
          const fullText = `${item.title}\n\n${item.story}`;
          const ok = await copyToClipboard(fullText);
          if (ok) this.showAlert('Cerita dicopy ke clipboard!', 'success');
        }
      });
    });

    const btnExportJson = document.getElementById('btn-export-history-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => {
        exportHistoryJSON(this.state.historyList);
      });
    }

    const inputImportJson = document.getElementById('input-import-history-json');
    if (inputImportJson) {
      inputImportJson.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const imported = await importHistoryJSON(file);
          for (const s of imported) {
            saveStory(s);
          }
          this.state.historyList = loadHistory();
          this.render();
          this.showAlert(`Berhasil mengimpor ${imported.length} cerita!`, 'success');
        } catch (err) {
          this.showAlert('File tidak valid: ' + err, 'error');
        }
      });
    }
  }

  // --- Execution Methods ---

  async executeMode2() {
    this.setLoading('Menyusun ide...');
    try {
      const options = await generateOutlineOptions({
        userIdea: '',
        theme: 'Bebas',
        updateStatus: (msg) => this.updateLoadingStatus(msg)
      });
      this.state.outlineOptions = options;
      this.currentView = 'outline-choices';
      this.render();
    } catch (err) {
      this.showAlert('Gagal menyusun ide: ' + err.message, 'error');
      this.currentView = 'home';
      this.render();
    }
  }

  async executeMode1A(idea, theme) {
    this.setLoading('Menyusun 5 alur dari ide Anda...');
    try {
      const options = await generateOutlineOptions({
        userIdea: idea,
        theme,
        updateStatus: (msg) => this.updateLoadingStatus(msg)
      });
      this.state.outlineOptions = options;
      this.currentView = 'outline-choices';
      this.render();
    } catch (err) {
      this.showAlert('Gagal menyusun opsi alur: ' + err.message, 'error');
      this.currentView = 'mode1-input';
      this.render();
    }
  }

  async executeMode3() {
    this.setLoading('Menyiapkan Wizard Story...');
    try {
      const premises = await generateInitialPremises({
        theme: 'Bebas',
        updateStatus: (msg) => this.updateLoadingStatus(msg)
      });
      this.state.wizardSelections = {};
      this.state.wizardChoicesCurrentStage = premises.map((p, idx) => ({
        id: String(idx + 1),
        label: p.title,
        detail: p.summary
      }));
      this.state.wizardStageIndex = 0;
      this.currentView = 'wizard-stage';
      this.render();
    } catch (err) {
      this.showAlert('Gagal memuat wizard: ' + err.message, 'error');
      this.currentView = 'home';
      this.render();
    }
  }

  async startWizardStage(index) {
    this.state.wizardStageIndex = index;
    if (index === 0 && this.state.wizardChoicesCurrentStage.length > 0) {
      this.currentView = 'wizard-stage';
      this.render();
      return;
    }

    this.setLoading(`Memuat pilihan untuk tahap ${WIZARD_STAGES[index].title}...`);
    try {
      const choices = await generateWizardStageChoices({
        stageIndex: index,
        currentSelections: this.state.wizardSelections,
        updateStatus: (msg) => this.updateLoadingStatus(msg)
      });
      this.state.wizardChoicesCurrentStage = choices;
      this.currentView = 'wizard-stage';
      this.render();
    } catch (err) {
      this.showAlert('Gagal memuat tahap wizard: ' + err.message, 'error');
    }
  }

  async finishWizardToReview() {
    this.setLoading('Menganalisis efektivitas alur cerita...');
    try {
      const whyItWorks = await generateOutlineReview(this.state.wizardSelections);
      this.state.wizardWhyItWorks = whyItWorks;
      this.currentView = 'wizard-review';
      this.render();
    } catch (err) {
      this.state.wizardWhyItWorks = 'Alur cerita misteri logis dengan eskalasi konflik yang proporsional.';
      this.currentView = 'wizard-review';
      this.render();
    }
  }

  async generateFinalStory(outline) {
    this.setLoading('Membangun alur & menulis draft...');
    try {
      const result = await generateFinalStoryFromOutline({
        outline,
        updateStatus: (msg) => this.updateLoadingStatus(msg)
      });

      // Generate Image Prompt
      this.updateLoadingStatus('Membuat prompt gambar cover...');
      let imagePrompt = '';
      try {
        imagePrompt = await generateImagePrompt({
          storyTitle: result.title,
          storyText: result.story
        });
      } catch (e) {
        console.warn('Image prompt generation skipped:', e);
      }

      const storyItem = {
        id: 'story_' + Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mode: this.currentView === 'wizard-review' ? 'Wizard Story' : 'Otomatis',
        title: result.title,
        story: result.story,
        outline: result.outline,
        imagePrompt,
        imageData: '',
        criticNotes: result.criticNotes
      };

      // Save to localStorage
      saveStory(storyItem);

      this.state.currentStory = storyItem;
      this.currentView = 'story-result';
      this.render();
      this.showAlert('Cerita berhasil dibuat!', 'success');
    } catch (err) {
      this.showAlert('Gagal membuat cerita: ' + err.message, 'error');
      this.render();
    }
  }

  async generateImage(prompt) {
    this.setLoading('Menghasilkan gambar cover AI...');
    try {
      const imageUrl = await generateStoryImage({
        prompt,
        updateStatus: (msg) => this.updateLoadingStatus(msg)
      });

      this.state.currentStory.imagePrompt = prompt;
      this.state.currentStory.imageData = imageUrl;
      saveStory(this.state.currentStory);

      this.currentView = 'story-result';
      this.render();
      this.showAlert('Gambar cover berhasil dibuat!', 'success');
    } catch (err) {
      this.showAlert('Gambar belum berhasil dibuat: ' + err.message, 'error');
      this.currentView = 'story-result';
      this.render();
    }
  }
}

export function initApp() {
  const app = new AppController();
  app.init();
}
