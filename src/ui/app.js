/**
 * Main Application Controller & State Manager — V3 Architecture with Interactive Chatbot & Rich Progress
 */

import { renderHeader, renderLoading, renderAlert, renderProposalCard, renderMobileBottomNav } from './components.js';
import {
  renderHomeView,
  renderMode1InputView,
  renderOutlineChoicesView,
  renderWizardStageView,
  renderWizardReviewView,
  renderImproveOutlineView,
  renderStoryResultView,
  renderWritingBrainView,
  renderResearchView,
  renderBrainstormView,
  renderBackupView,
  renderSettingsView,
  renderHistoryView
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
import {
  getWritingBrainEntries,
  addKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry,
  getStyleProfile,
  checkBrainHealth,
  BRAIN_CATEGORIES
} from '../core/writing-brain.js';
import {
  executeResearch,
  getResearchSessions,
  getResearchSessionById
} from '../core/research-engine.js';
import {
  getBrainstormConversations,
  getBrainstormConversationById,
  createBrainstormConversation,
  sendBrainstormMessage,
  initiateStoryFeedbackLoop
} from '../core/brainstorm-engine.js';
import {
  createFullAppBackupZip,
  parseAndValidateBackupZip,
  executeRestore,
  getBackupHistoryMetadata
} from '../core/backup-engine.js';
import { copyToClipboard } from '../utils/clipboard.js';
import { exportStoryMarkdown } from '../utils/export.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

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
      
      // V3 Domain State
      wbFilterCategory: 'all',
      wbSearchQuery: '',
      wbHealthReport: null,
      researchMode: 'quick',
      activeResearchSession: null,
      activeBrainstormConvId: null,
      restorePreview: null,
      loadingState: null,
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

  setLoading(message, currentStep = 0, totalSteps = 0, stepList = []) {
    this.state.loadingState = { message, currentStep, totalSteps, stepList };
    const container = document.getElementById('app-content');
    if (container) {
      container.innerHTML = renderLoading(message, currentStep, totalSteps, stepList);
    }
  }

  updateLoadingStatus(message, currentStep, totalSteps, stepList = []) {
    if (this.state.loadingState) {
      if (message) this.state.loadingState.message = message;
      if (currentStep !== undefined && currentStep !== null) this.state.loadingState.currentStep = currentStep;
      if (totalSteps !== undefined && totalSteps !== null) this.state.loadingState.totalSteps = totalSteps;
      if (stepList.length > 0) this.state.loadingState.stepList = stepList;
    } else {
      this.state.loadingState = { message, currentStep: currentStep || 0, totalSteps: totalSteps || 0, stepList };
    }
    const container = document.getElementById('app-content');
    if (container) {
      const s = this.state.loadingState;
      container.innerHTML = renderLoading(s.message, s.currentStep, s.totalSteps, s.stepList);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    } else if (this.currentView === 'brain') {
      contentHtml = renderWritingBrainView({
        entries: getWritingBrainEntries(),
        profile: getStyleProfile(),
        healthReport: this.state.wbHealthReport,
        filterCategory: this.state.wbFilterCategory,
        searchQuery: this.state.wbSearchQuery
      });
    } else if (this.currentView === 'research') {
      contentHtml = renderResearchView({
        sessions: getResearchSessions(),
        activeSession: this.state.activeResearchSession,
        mode: this.state.researchMode
      });
    } else if (this.currentView === 'brainstorm') {
      const activeConv = getBrainstormConversationById(this.state.activeBrainstormConvId);
      contentHtml = renderBrainstormView({ conversation: activeConv });
    } else if (this.currentView === 'backup') {
      contentHtml = renderBackupView({
        historyMeta: getBackupHistoryMetadata(),
        restorePreview: this.state.restorePreview
      });
    } else if (this.currentView === 'settings') {
      contentHtml = renderSettingsView(getSettings(), this.state.scannedTextModels, this.state.scannedImageModels);
    } else if (this.currentView === 'history') {
      contentHtml = renderHistoryView(this.state.historyList);
    }

    root.innerHTML = `
      ${renderHeader({ activeView: this.currentView })}
      <main class="app-main">
        ${this.state.alert ? renderAlert(this.state.alert.message, this.state.alert.type) : ''}
        <div id="app-content">${contentHtml}</div>
      </main>
      ${renderMobileBottomNav({ activeView: this.currentView })}
    `;

    this.bindViewEvents();
  }

  bindViewEvents() {
    this.bindMode1Events();
    this.bindOutlineEvents();
    this.bindWizardEvents();
    this.bindStoryResultEvents();
    this.bindWritingBrainEvents();
    this.bindResearchEvents();
    this.bindBrainstormEvents();
    this.bindBackupEvents();
    this.bindSettingsEvents();
    this.bindHistoryEvents();
    this.bindProposalApprovalEvents();
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

    const btnGenerateWizardFinal = document.getElementById('btn-generate-wizard-final');
    if (btnGenerateWizardFinal) {
      btnGenerateWizardFinal.addEventListener('click', () => {
        this.generateFinalStory(this.state.wizardSelections);
      });
    }

    const btnImproveWizardOutline = document.getElementById('btn-improve-wizard-outline');
    if (btnImproveWizardOutline) {
      btnImproveWizardOutline.addEventListener('click', async () => {
        const steps = ['Menganalisis alur saat ini', 'Merancang perbaikan dinamika misteri'];
        this.setLoading('Merancang perbaikan alur cerita...', 1, 2, steps);
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
      });
    }

    // Story Critique Feedback Loop
    const btnCritiqueStory = document.getElementById('btn-critique-story');
    if (btnCritiqueStory) {
      btnCritiqueStory.addEventListener('click', async () => {
        const userFeedback = prompt('Berikan masukan/kritik tentang cerita ini untuk didiskusikan dengan Editor AI (misal: "Dialog terlalu kaku" atau "Ending terlalu menjelaskan"):');
        if (userFeedback === null) return;

        const steps = ['Membaca konteks cerita', 'Menganalisis masukan pengguna', 'Menyusun saran perbaikan'];
        this.setLoading('Membuka sesi diskusi kritik cerita...', 1, 3, steps);
        try {
          const res = await initiateStoryFeedbackLoop({
            story: this.state.currentStory,
            userCritique: userFeedback,
            updateStatus: (msg) => this.updateLoadingStatus(msg)
          });
          this.state.activeBrainstormConvId = res.conversation.id;
          this.currentView = 'brainstorm';
          this.render();
          this.showAlert('Sesi diskusi kritik cerita berhasil dibuka!', 'success');
        } catch (err) {
          this.showAlert('Gagal membuka diskusi kritik: ' + err.message, 'error');
          this.render();
        }
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

  bindWritingBrainEvents() {
    const btnAddWb = document.getElementById('btn-wb-add-entry');
    if (btnAddWb) {
      btnAddWb.addEventListener('click', () => {
        const title = prompt('Judul Knowledge:');
        if (!title) return;
        const content = prompt('Isi Aturan / Knowledge (1-2 kalimat):');
        if (!content) return;
        const category = prompt(`Kategori (Pilih salah satu:\n${BRAIN_CATEGORIES.join(', ')}):`, 'User Preferences');

        addKnowledgeEntry({
          title,
          content,
          category: BRAIN_CATEGORIES.includes(category) ? category : 'User Preferences',
          source: 'user'
        });
        this.render();
        this.showAlert('Knowledge baru berhasil ditambahkan!', 'success');
      });
    }

    const btnHealth = document.getElementById('btn-wb-health-check');
    if (btnHealth) {
      btnHealth.addEventListener('click', () => {
        this.state.wbHealthReport = checkBrainHealth();
        this.render();
        this.showAlert('Health check Writing Brain selesai!', 'success');
      });
    }

    const searchInput = document.getElementById('wb-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.wbSearchQuery = e.target.value;
        this.render();
      });
    }

    const catFilter = document.getElementById('wb-category-filter');
    if (catFilter) {
      catFilter.addEventListener('change', (e) => {
        this.state.wbFilterCategory = e.target.value;
        this.render();
      });
    }

    const editBtns = document.querySelectorAll('.btn-edit-wb');
    editBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const entries = getWritingBrainEntries();
        const item = entries.find(e => e.id === id);
        if (!item) return;

        const newContent = prompt('Edit Isi Knowledge:', item.content);
        if (newContent && newContent.trim()) {
          updateKnowledgeEntry(id, { content: newContent.trim() });
          this.render();
          this.showAlert('Knowledge berhasil diperbarui!', 'success');
        }
      });
    });

    const delBtns = document.querySelectorAll('.btn-delete-wb');
    delBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm('Hapus entri knowledge ini dari Writing Brain?')) {
          deleteKnowledgeEntry(id);
          this.render();
          this.showAlert('Knowledge berhasil dihapus.', 'info');
        }
      });
    });
  }

  bindResearchEvents() {
    const modeSegmentBtns = document.querySelectorAll('#research-mode-segmented .mode-segment-btn');
    modeSegmentBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        this.state.researchMode = mode;
        
        modeSegmentBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const hiddenInput = document.getElementById('research-mode-hidden-input');
        if (hiddenInput) hiddenInput.value = mode;

        const descBox = document.getElementById('research-mode-desc-text');
        if (descBox) {
          descBox.innerHTML = mode === 'deep'
            ? '🔬 <strong>Deep Research (~30s):</strong> Membandingkan sudut pandang, menyusun analisis mendalam, dan merumuskan usulan aturan komprehensif.'
            : '⚡ <strong>Quick Research (~10s):</strong> Ringkas & cepat. Menghasilkan temuan kunci dan usulan aturan praktis secara langsung.';
        }
      });
    });

    const researchForm = document.getElementById('research-form');
    if (researchForm) {
      researchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = document.getElementById('research-question-input').value;
        const manualText = document.getElementById('research-manual-text').value;
        const hiddenInput = document.getElementById('research-mode-hidden-input');
        const mode = hiddenInput ? hiddenInput.value : (this.state.researchMode || 'quick');

        if (!question || !question.trim()) {
          this.showAlert('Masukkan pertanyaan riset terlebih dahulu.', 'error');
          return;
        }

        const researchSteps = [
          'Mengumpulkan sumber & referensi sastra',
          'Melakukan sintesis & analisis teknik penulisan',
          'Merumuskan rekomendasi & usulan aturan (proposals)'
        ];

        this.setLoading(`Melakukan ${mode === 'deep' ? 'Deep Research' : 'Quick Research'}...`, 1, 3, researchSteps);
        try {
          const report = await executeResearch({
            question,
            mode,
            manualSourceText: manualText,
            updateStatus: (msg) => {
              let step = 1;
              if (msg.includes('sintesis') || msg.includes('analisis')) step = 2;
              if (msg.includes('usulan') || msg.includes('rekomendasi')) step = 3;
              this.updateLoadingStatus(msg, step, 3, researchSteps);
            }
          });
          this.state.activeResearchSession = report;
          this.currentView = 'research';
          this.render();
          this.showAlert('Riset selesai! Tinjau usulan aturan (proposals) di bawah.', 'success');
        } catch (err) {
          this.showAlert('Gagal riset: ' + err.message, 'error');
          this.currentView = 'research';
          this.render();
        }
      });
    }

    const openResearchBtns = document.querySelectorAll('.btn-open-research');
    openResearchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const session = getResearchSessionById(id);
        if (session) {
          this.state.activeResearchSession = session;
          this.render();
        }
      });
    });
  }

  // --- Interactive Chatbot Experience for Brainstorming ---

  bindBrainstormEvents() {
    const brainstormForm = document.getElementById('brainstorm-form');
    const inputArea = document.getElementById('brainstorm-input-text');
    const chatWin = document.getElementById('brainstorm-chat-window');

    if (!brainstormForm || !inputArea || !chatWin) return;

    // Auto-scroll chat to bottom
    chatWin.scrollTop = chatWin.scrollHeight;

    const handleSendInline = async (mode) => {
      const text = inputArea.value;
      if (!text || !text.trim()) return;

      const userText = text.trim();
      inputArea.value = ''; // Clear immediately
      inputArea.focus();

      // 1. Append User Message Bubble immediately
      const placeholderMsg = chatWin.querySelector('div[style*="text-align: center"]');
      if (placeholderMsg) placeholderMsg.remove();

      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble chat-user';
      userBubble.innerHTML = `
        <div style="font-size: 0.75rem; opacity: 0.8; margin-bottom: 0.25rem;">ANDA</div>
        <div style="font-size: 0.92rem; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(userText)}</div>
      `;
      chatWin.appendChild(userBubble);

      // 2. Append AI Typing Indicator Bubble immediately
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'chat-bubble chat-ai chat-typing';
      typingIndicator.id = 'ai-typing-indicator';
      typingIndicator.innerHTML = `
        <div class="chat-typing-container">
          <span>Editor AI sedang berpikir</span>
          <div class="typing-dots">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      `;
      chatWin.appendChild(typingIndicator);
      chatWin.scrollTop = chatWin.scrollHeight;

      // Disable buttons while waiting
      const btnDiscuss = document.getElementById('btn-send-discuss');
      const btnCritique = document.getElementById('btn-send-critique');
      if (btnDiscuss) btnDiscuss.disabled = true;
      if (btnCritique) btnCritique.disabled = true;

      try {
        const res = await sendBrainstormMessage({
          conversationId: this.state.activeBrainstormConvId,
          userMessage: userText,
          mode
        });

        this.state.activeBrainstormConvId = res.conversation.id;

        // Remove typing indicator
        if (typingIndicator.parentNode) typingIndicator.remove();

        // 3. Append Real AI Message Bubble
        const latestAiMsg = res.conversation.messages[res.conversation.messages.length - 1];
        const aiBubble = document.createElement('div');
        aiBubble.className = 'chat-bubble chat-ai';
        aiBubble.innerHTML = `
          <div style="font-size: 0.75rem; opacity: 0.8; margin-bottom: 0.25rem;">EDITOR AI</div>
          <div style="font-size: 0.92rem; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(latestAiMsg.text)}</div>
          
          ${latestAiMsg.critiqueBreakdown && latestAiMsg.critiqueBreakdown.problems ? `
            <div style="margin-top: 0.75rem; background: rgba(0,0,0,0.04); padding: 0.65rem 0.85rem; border-radius: 6px; font-size: 0.85rem;">
              <strong>🔍 Kelemahan:</strong> ${escapeHtml(latestAiMsg.critiqueBreakdown.problems)}<br/>
              <strong>💡 Saran:</strong> ${escapeHtml(latestAiMsg.critiqueBreakdown.suggestedImprovement)}
            </div>
          ` : ''}
        `;
        chatWin.appendChild(aiBubble);

        // 4. Append Proposal Card if generated
        if (res.newProposal) {
          const propContainer = document.createElement('div');
          propContainer.innerHTML = renderProposalCard(res.newProposal);
          chatWin.appendChild(propContainer.firstElementChild);
          this.bindProposalApprovalEvents();
        }

        chatWin.scrollTop = chatWin.scrollHeight;
      } catch (err) {
        if (typingIndicator.parentNode) typingIndicator.remove();
        this.showAlert('Gagal memproses percakapan: ' + err.message, 'error');
      } finally {
        if (btnDiscuss) btnDiscuss.disabled = false;
        if (btnCritique) btnCritique.disabled = false;
      }
    };

    brainstormForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendInline('discuss');
    });

    const btnCritique = document.getElementById('btn-send-critique');
    if (btnCritique) {
      btnCritique.addEventListener('click', () => handleSendInline('critique'));
    }

    // Keyboard shortcut: Enter to send, Shift+Enter for newline
    inputArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendInline('discuss');
      }
    });

    const btnNewBs = document.getElementById('btn-new-brainstorm');
    if (btnNewBs) {
      btnNewBs.addEventListener('click', () => {
        const newConv = createBrainstormConversation();
        this.state.activeBrainstormConvId = newConv.id;
        this.render();
      });
    }
  }

  bindProposalApprovalEvents() {
    const approveBtns = document.querySelectorAll('.btn-approve-proposal');
    approveBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.proposal-card');
        if (!card) return;

        const titleEl = card.querySelector('h4');
        const contentEl = card.querySelector('p');
        const tagEl = card.querySelector('.tag');

        const title = titleEl ? titleEl.textContent.trim().split('\n')[0] : 'Proposed Rule';
        const category = tagEl ? tagEl.textContent.trim() : 'Learned Rules';
        const content = contentEl ? contentEl.textContent.replace(/^"|"$/g, '').trim() : '';

        addKnowledgeEntry({
          title,
          category,
          content,
          type: 'rule',
          source: 'research'
        });

        card.style.opacity = '0.5';
        card.style.pointerEvents = 'none';
        btn.textContent = '✅ Approved & Saved!';
        this.showAlert(`Rule "${title}" berhasil ditambahkan ke Writing Brain!`, 'success');
      });
    });

    const editProposalBtns = document.querySelectorAll('.btn-edit-proposal');
    editProposalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.proposal-card');
        if (!card) return;
        const contentEl = card.querySelector('p');
        if (!contentEl) return;

        const newContent = prompt('Edit Isi Rule Proposal:', contentEl.textContent.replace(/^"|"$/g, '').trim());
        if (newContent && newContent.trim()) {
          contentEl.textContent = `"${newContent.trim()}"`;
          this.showAlert('Usulan rule diperbarui. Klik Approve untuk menyimpan ke Writing Brain.', 'info');
        }
      });
    });

    const rejectProposalBtns = document.querySelectorAll('.btn-reject-proposal');
    rejectProposalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.proposal-card');
        if (card) {
          card.remove();
          this.showAlert('Usulan rule ditolak.', 'info');
        }
      });
    });

    const discussProposalBtns = document.querySelectorAll('.btn-discuss-proposal');
    discussProposalBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const card = btn.closest('.proposal-card');
        if (!card) return;
        const contentEl = card.querySelector('p');
        const content = contentEl ? contentEl.textContent.replace(/^"|"$/g, '') : '';

        const conv = createBrainstormConversation(`Diskusi Proposal: ${content.slice(0, 25)}...`);
        this.state.activeBrainstormConvId = conv.id;
        this.currentView = 'brainstorm';
        this.render();

        const inputArea = document.getElementById('brainstorm-input-text');
        if (inputArea) {
          inputArea.value = `Saya ingin mendiskusikan usulan rule ini: "${content}". Apakah aturan ini sudah tepat atau perlu disesuaikan?`;
        }
      });
    });
  }

  bindBackupEvents() {
    const btnExportZip = document.getElementById('btn-export-full-zip');
    if (btnExportZip) {
      btnExportZip.addEventListener('click', async () => {
        const options = {
          includeWritingBrain: document.getElementById('chk-bk-brain').checked,
          includeResearch: document.getElementById('chk-bk-research').checked,
          includeBrainstorm: document.getElementById('chk-bk-brainstorm').checked,
          includeStories: document.getElementById('chk-bk-stories').checked,
          includeImages: document.getElementById('chk-bk-images').checked,
          includeAiSettings: document.getElementById('chk-bk-ai').checked,
          includeApiKeys: document.getElementById('chk-bk-keys').checked
        };

        if (options.includeApiKeys) {
          if (!confirm('⚠️ WARNING: Backup ini akan memuat API Key Anda secara jelas. Pastikan Anda tidak membagikan file ZIP ini secara publik. Lanjutkan?')) {
            return;
          }
        }

        const backupSteps = [
          'Mengumpulkan data domain',
          'Menyusun struktur file JSON',
          'Memproses gambar cover',
          'Mengompresi file ZIP'
        ];

        this.setLoading('Menyiapkan Full App ZIP Backup...', 1, 4, backupSteps);
        try {
          const backupRes = await createFullAppBackupZip(options, (msg) => {
            let step = 1;
            if (msg.includes('JSON') || msg.includes('Manifest')) step = 2;
            if (msg.includes('gambar')) step = 3;
            if (msg.includes('ZIP')) step = 4;
            this.updateLoadingStatus(msg, step, 4, backupSteps);
          });
          
          const blob = new Blob([backupRes.blob], { type: 'application/zip' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = backupRes.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          this.currentView = 'backup';
          this.render();
          this.showAlert(`Backup berhasil dibuat: ${backupRes.fileName}`, 'success');
        } catch (err) {
          this.showAlert('Gagal membuat backup ZIP: ' + err.message, 'error');
          this.currentView = 'backup';
          this.render();
        }
      });
    }

    const inputImportZip = document.getElementById('input-import-backup-zip');
    if (inputImportZip) {
      inputImportZip.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const importSteps = ['Membaca file ZIP', 'Validasi manifest', 'Pratinjau data'];
        this.setLoading('Membaca & memvalidasi file backup ZIP...', 1, 3, importSteps);
        try {
          const parsed = await parseAndValidateBackupZip(file, (msg) => {
            let step = 1;
            if (msg.includes('Manifest')) step = 2;
            if (msg.includes('Pratinjau')) step = 3;
            this.updateLoadingStatus(msg, step, 3, importSteps);
          });
          this.state.restorePreview = parsed;
          this.currentView = 'backup';
          this.render();
          this.showAlert('File ZIP valid! Tinjau pratinjau di bawah dan pilih strategi Restore.', 'success');
        } catch (err) {
          this.showAlert(err.message, 'error');
          this.currentView = 'backup';
          this.render();
        }
      });
    }

    const btnRestoreMerge = document.getElementById('btn-restore-merge');
    if (btnRestoreMerge) {
      btnRestoreMerge.addEventListener('click', () => {
        if (!this.state.restorePreview) return;
        const steps = ['Validasi data', 'Memulihkan data domain', 'Menggabungkan entri'];
        this.setLoading('Melakukan Restore (MERGE)...', 1, 3, steps);
        try {
          executeRestore({
            backupData: this.state.restorePreview,
            strategy: 'merge',
            restoreAiSettings: !!this.state.restorePreview.aiSettings,
            updateStatus: (msg) => this.updateLoadingStatus(msg, 2, 3, steps)
          });

          this.state.restorePreview = null;
          this.currentView = 'backup';
          this.render();
          this.showAlert('Data aplikasi berhasil digabungkan (Merge) dari backup ZIP!', 'success');
        } catch (err) {
          this.showAlert('Gagal memulihkan data: ' + err.message, 'error');
          this.render();
        }
      });
    }

    const btnRestoreReplace = document.getElementById('btn-restore-replace');
    if (btnRestoreReplace) {
      btnRestoreReplace.addEventListener('click', () => {
        if (!this.state.restorePreview) return;
        if (!confirm('⚠️ PERINGATAN KETAT: Seluruh data lokal saat ini akan DIGANTIKAN oleh isi file backup ZIP. Lanjutkan?')) {
          return;
        }

        const steps = ['Membersihkan data lama', 'Memulihkan data backup', 'Mengganti data domain'];
        this.setLoading('Melakukan Restore (REPLACE ALL)...', 1, 3, steps);
        try {
          executeRestore({
            backupData: this.state.restorePreview,
            strategy: 'replace',
            restoreAiSettings: !!this.state.restorePreview.aiSettings,
            updateStatus: (msg) => this.updateLoadingStatus(msg, 2, 3, steps)
          });

          this.state.restorePreview = null;
          this.currentView = 'backup';
          this.render();
          this.showAlert('Seluruh data aplikasi berhasil diganti dari backup ZIP!', 'success');
        } catch (err) {
          this.showAlert('Gagal memulihkan data: ' + err.message, 'error');
          this.render();
        }
      });
    }

    const btnRestoreCancel = document.getElementById('btn-restore-cancel');
    if (btnRestoreCancel) {
      btnRestoreCancel.addEventListener('click', () => {
        this.state.restorePreview = null;
        this.render();
      });
    }
  }

  bindSettingsEvents() {
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

    const modelChips = document.querySelectorAll('.model-chip');
    modelChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const modelName = chip.dataset.model;
        const targetId = chip.dataset.target;
        const input = document.getElementById(targetId);
        if (input) {
          input.value = modelName;
          const container = chip.closest('.model-chips');
          if (container) {
            container.querySelectorAll('.model-chip').forEach(c => c.classList.remove('model-chip-active'));
          }
          chip.classList.add('model-chip-active');
        }
      });
    });

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
          this.showAlert(`✅ Ditemukan ${models.length} model text!`, 'success');
        } catch (err) {
          this.showAlert(err.message, 'error');
          btnScanText.disabled = false;
          btnScanText.textContent = '🔍 Pindai';
        }
      });
    }

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
          this.showAlert(`✅ Ditemukan ${models.length} model gambar!`, 'success');
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
  }

  // --- Execution Methods with Multi-Step Visual Progress ---

  async executeMode2() {
    const steps = ['Menyusun 5 alur misteri realistis'];
    this.setLoading('Menyusun ide alur cerita...', 1, 1, steps);
    try {
      const options = await generateOutlineOptions({
        userIdea: '',
        theme: 'Bebas',
        updateStatus: (msg) => this.updateLoadingStatus(msg, 1, 1, steps)
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
    const steps = ['Menyusun 5 pilihan alur dari ide Anda'];
    this.setLoading('Menyusun 5 alur dari ide Anda...', 1, 1, steps);
    try {
      const options = await generateOutlineOptions({
        userIdea: idea,
        theme,
        updateStatus: (msg) => this.updateLoadingStatus(msg, 1, 1, steps)
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
    const steps = ['Menyiapkan 5 pilihan premis awal'];
    this.setLoading('Menyiapkan Story Wizard...', 1, 1, steps);
    try {
      const premises = await generateInitialPremises({
        theme: 'Bebas',
        updateStatus: (msg) => this.updateLoadingStatus(msg, 1, 1, steps)
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

    const steps = [`Memuat opsi adaptif untuk tahap ${WIZARD_STAGES[index].title}`];
    this.setLoading(`Memuat tahap ${WIZARD_STAGES[index].title}...`, 1, 1, steps);
    try {
      const choices = await generateWizardStageChoices({
        stageIndex: index,
        currentSelections: this.state.wizardSelections,
        updateStatus: (msg) => this.updateLoadingStatus(msg, 1, 1, steps)
      });
      this.state.wizardChoicesCurrentStage = choices;
      this.currentView = 'wizard-stage';
      this.render();
    } catch (err) {
      this.showAlert('Gagal memuat tahap wizard: ' + err.message, 'error');
    }
  }

  async finishWizardToReview() {
    const steps = ['Menganalisis efektivitas dramatis & logis alur'];
    this.setLoading('Menganalisis alur cerita...', 1, 1, steps);
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
    const storySteps = [
      'Membangun Scene Plan terstruktur (3-4 adegan)',
      'Menulis draft cerpen utuh adegan demi adegan (±1.000 kata)',
      'Melakukan Quality Audit V2 & Humanization Pass'
    ];

    this.setLoading('Membangun logika cerita & scene plan...', 1, 3, storySteps);

    try {
      const result = await generateFinalStoryFromOutline({
        outline,
        updateStatus: (msg) => {
          let currentStep = 1;
          if (msg.includes('draft') || msg.includes('Menulis')) currentStep = 2;
          if (msg.includes('Audit') || msg.includes('Humanization')) currentStep = 3;
          this.updateLoadingStatus(msg, currentStep, 3, storySteps);
        }
      });

      this.updateLoadingStatus('Membuat prompt gambar cover...', 3, 3, storySteps);
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
    const imageSteps = [
      'Menyusun prompt visual metro-pop Indonesia',
      'Menghubungi AI Image Provider'
    ];

    this.setLoading('Menghasilkan gambar cover AI...', 1, 2, imageSteps);
    try {
      const imageUrl = await generateStoryImage({
        prompt,
        updateStatus: (msg) => this.updateLoadingStatus(msg, 2, 2, imageSteps)
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
