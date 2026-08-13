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
import { loadHistory, saveStory, deleteStory, getStoryById, setupHistorySupabase } from '../core/history.js';
import { generateOutlineOptions, generateFinalStoryFromOutline } from '../core/story-engine.js';
import {
  WIZARD_STAGES,
  generateInitialPremises,
  generateWizardStageChoices,
  generateOutlineReview,
  improveOutline
} from '../core/wizard-engine.js';
import { generateImagePrompt, generateStoryImage } from '../core/image-engine.js';
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
      alert: null
    };

    // Initialize Supabase if settings exist
    setupHistorySupabase();
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

  async navigate(viewName) {
    this.currentView = viewName;
    if (viewName === 'history') {
      this.setLoading('Memuat riwayat cerita...');
      this.state.historyList = await loadHistory();
    }
    this.render();
  }

  async handleAction(action, target) {
    if (action === 'start-mode-1') {
      this.currentView = 'mode1-input';
      this.render();
    } else if (action === 'start-mode-2') {
      this.executeMode2();
    } else if (action === 'start-mode-3') {
      this.executeMode3();
    }
  }

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
      contentHtml = renderSettingsView(getSettings());
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

  bindViewEvents() {
    // Mode 1 submit
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

    // Outline choices selection
    const outlineBtns = document.querySelectorAll('.btn-select-outline');
    outlineBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.index, 10);
        const selected = this.state.outlineOptions[idx];
        this.generateFinalStory(selected);
      });
    });

    // Wizard Stage choices selection
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

    // Wizard Review Buttons
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

    // Improve Outline Options Buttons
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

    // Story Result View Buttons
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

    // Settings Form submit
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
          endpoint: document.getElementById('setting-endpoint').value,
          apiKey: document.getElementById('setting-apiKey').value,
          model: document.getElementById('setting-model').value,
          imageEndpoint: document.getElementById('setting-imageEndpoint').value,
          imageApiKey: document.getElementById('setting-imageApiKey').value,
          imageModel: document.getElementById('setting-imageModel').value,
          supabaseUrl: document.getElementById('setting-supabaseUrl').value,
          supabaseAnonKey: document.getElementById('setting-supabaseAnonKey').value
        };
        saveSettings(updated);
        setupHistorySupabase();
        this.showAlert('Pengaturan berhasil disimpan!', 'success');
      });
    }

    // History View Actions
    const openHistoryBtns = document.querySelectorAll('.btn-open-history');
    openHistoryBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const item = await getStoryById(id);
        if (item) {
          this.state.currentStory = item;
          this.currentView = 'story-result';
          this.render();
        }
      });
    });

    const deleteHistoryBtns = document.querySelectorAll('.btn-delete-history');
    deleteHistoryBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (confirm('Hapus cerita ini dari riwayat?')) {
          this.state.historyList = await deleteStory(id);
          this.render();
          this.showAlert('Cerita berhasil dihapus.', 'info');
        }
      });
    });

    const copyHistoryBtns = document.querySelectorAll('.btn-copy-history');
    copyHistoryBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const item = await getStoryById(id);
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
            await saveStory(s);
          }
          this.state.historyList = await loadHistory();
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

      // Save to localStorage & Supabase
      await saveStory(storyItem);

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
      await saveStory(this.state.currentStory);

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
