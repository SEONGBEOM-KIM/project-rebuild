import AuthViewManager, { AUTH_MODES } from './AuthViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';
import { createTextButton } from '../ui/TextButton.js';

const renderText = (scene, x, y, text, style, origin = 0.5) => createLayoutText(scene, { x, y, text }, { style, origin });

export default class AuthRenderer {
  static renderAuthScreen(scene, width, height, mode, handlers = {}) {
    const layout = AuthViewManager.getLayout();
    const activeMode = AuthViewManager.getMode(mode);
    if (mode === AUTH_MODES.entry) return AuthRenderer.renderEntry(scene, width, handlers);
    if (mode === AUTH_MODES.guestConfirm) return AuthRenderer.renderGuestConfirmation(scene, width, height, handlers);
    const rail = layout.modeRail;
    const card = layout.card;
    const objects = {};

    objects.modeRail = createPanelBackground(scene, rail, { fillColor: rail.fillColor });
    AuthViewManager.getModeTabs(width, mode).forEach((tab) => {
      const tabButton = createTextButton(scene, {
        x: tab.x,
        y: tab.y,
        label: tab.label,
        textColor: layout.modeStyle.textColor,
        backgroundColor: tab.active ? layout.modeStyle.activeColor : layout.modeStyle.inactiveColor,
      }, { fontSize: layout.modeStyle.fontSize, padding: { x: 28, y: 12 } });
      tabButton.on('pointerdown', () => handlers.onModeChange?.(tab.id));
      if (tab.active) objects.activeTab = tabButton;
    });

    objects.card = createPanelBackground(scene, card, {
      fillColor: card.fillColor,
      strokeWidth: card.strokeWidth,
      strokeColor: card.strokeColor,
    });
    objects.cardTitle = renderText(scene, card.x, card.y - 220, activeMode.title, {
      fontSize: '38px', color: '#ffffff', fontStyle: 'bold',
    });
    objects.description = renderText(scene, card.x, card.y - 168, activeMode.description, {
      fontSize: '21px', color: '#bfdbfe', align: 'center',
    });

    activeMode.fields.forEach((field, index) => {
      objects[`field${index}`] = AuthRenderer.renderField(scene, card, field, index, activeMode.fields.length);
    });

    const submitY = card.y + 178;
    objects.submitButton = createTextButton(scene, {
      x: card.x,
      y: submitY,
      label: activeMode.submitLabel,
      textColor: '#0f172a',
      backgroundColor: '#a7f3d0',
    }, { fontSize: '26px', fontStyle: 'bold', padding: { x: 32, y: 16 } });
    objects.submitButton.on('pointerdown', () => handlers.onSubmit?.(mode));

    if (mode === AUTH_MODES.teacherLogin || mode === AUTH_MODES.teacherRecovery) {
      objects.helperButton = createTextButton(scene, {
        x: card.x,
        y: card.y + 246,
        label: activeMode.helperLabel,
        textColor: '#93c5fd',
        backgroundColor: '#172554',
      }, { fontSize: '19px', padding: { x: 12, y: 6 } });
      objects.helperButton.on('pointerdown', () => handlers.onModeChange?.(
        mode === AUTH_MODES.teacherLogin ? AUTH_MODES.teacherRecovery : AUTH_MODES.teacherLogin,
      ));
    } else {
      objects.helper = renderText(scene, card.x, card.y + 246, activeMode.helperLabel, {
        fontSize: '19px', color: '#93c5fd',
      });
    }

    if (mode === AUTH_MODES.teacherLogin) {
      objects.signupButton = createTextButton(scene, {
        ...AuthViewManager.getSignupButton(width),
        textColor: '#dbeafe',
        backgroundColor: '#1e3a5f',
      }, { fontSize: '20px', padding: { x: 20, y: 10 } });
      objects.signupButton.on('pointerdown', () => handlers.onModeChange?.(AUTH_MODES.teacherSignup));
    } else if (mode === AUTH_MODES.teacherSignup) {
      objects.loginButton = createTextButton(scene, {
        x: width / 2, y: 770, label: '이미 계정이 있다면 교사 로그인',
        textColor: '#dbeafe', backgroundColor: '#1e3a5f',
      }, { fontSize: '20px', padding: { x: 20, y: 10 } });
      objects.loginButton.on('pointerdown', () => handlers.onModeChange?.(AUTH_MODES.teacherLogin));
    } else if (mode === AUTH_MODES.teacherRecovery) {
      objects.loginButton = createTextButton(scene, {
        x: width / 2, y: 770, label: '처음이라면 교사 회원가입',
        textColor: '#dbeafe', backgroundColor: '#1e3a5f',
      }, { fontSize: '20px', padding: { x: 20, y: 10 } });
      objects.loginButton.on('pointerdown', () => handlers.onModeChange?.(AUTH_MODES.teacherSignup));
    }

    objects.backButton = createTextButton(scene, {
      x: width / 2, y: 838, label: '입장 방법 다시 선택하기',
      textColor: '#bfdbfe', backgroundColor: '#0f1f3d',
    }, { fontSize: '19px', padding: { x: 18, y: 8 } });
    objects.backButton.on('pointerdown', () => handlers.onModeChange?.(AUTH_MODES.entry));

    return objects;
  }

  static renderEntry(scene, width, handlers = {}) {
    const { card } = AuthViewManager.getLayout();
    const objects = {};
    objects.card = createPanelBackground(scene, card, {
      fillColor: card.fillColor,
      strokeWidth: card.strokeWidth,
      strokeColor: card.strokeColor,
    });
    objects.cardTitle = renderText(scene, card.x, card.y - 166, '입장 방법을 선택하세요', {
      fontSize: '38px', color: '#ffffff', fontStyle: 'bold',
    });
    objects.description = renderText(scene, card.x, card.y - 112, '학생은 인증코드로, 교사는 계정으로 입장합니다.', {
      fontSize: '21px', color: '#bfdbfe',
    });
    objects.studentButton = createTextButton(scene, {
      x: card.x - 185, y: card.y + 18, label: '학생 로그인',
      textColor: '#0f172a', backgroundColor: '#a7f3d0',
    }, { fontSize: '30px', fontStyle: 'bold', padding: { x: 44, y: 22 } });
    objects.teacherButton = createTextButton(scene, {
      x: card.x + 185, y: card.y + 18, label: '교사 로그인',
      textColor: '#eff6ff', backgroundColor: '#2563eb',
    }, { fontSize: '30px', fontStyle: 'bold', padding: { x: 44, y: 22 } });
    objects.studentButton.on('pointerdown', () => handlers.onModeChange?.(AUTH_MODES.studentCode));
    objects.teacherButton.on('pointerdown', () => handlers.onModeChange?.(AUTH_MODES.teacherLogin));
    objects.guestButton = createTextButton(scene, {
      ...AuthViewManager.getGuestButton(width),
      textColor: '#fde68a', backgroundColor: '#172554',
    }, { fontSize: '20px', padding: { x: 12, y: 6 } });
    objects.guestButton.on('pointerdown', () => handlers.onModeChange?.(AUTH_MODES.guestConfirm));
    return objects;
  }

  static renderGuestConfirmation(scene, width, height, handlers = {}) {
    const content = AuthViewManager.getMode(AUTH_MODES.guestConfirm);
    const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x020617, 0.78);
    const popup = createPanelBackground(scene, {
      x: width / 2, y: height / 2, width: 680, height: 330,
    }, { fillColor: 0x172554, strokeWidth: 3, strokeColor: 0xfbbf24 });
    const title = renderText(scene, width / 2, height / 2 - 92, content.title, {
      fontSize: '32px', color: '#fef3c7', fontStyle: 'bold',
    });
    const body = renderText(scene, width / 2, height / 2 - 36, content.description, {
      fontSize: '22px', color: '#e2e8f0',
    });
    const confirm = createTextButton(scene, {
      x: width / 2 + 130, y: height / 2 + 88, label: content.submitLabel,
      textColor: '#0f172a', backgroundColor: '#a7f3d0',
    }, { fontSize: '21px', fontStyle: 'bold', padding: { x: 22, y: 12 } });
    const cancel = createTextButton(scene, {
      x: width / 2 - 130, y: height / 2 + 88, label: '취소',
      textColor: '#dbeafe', backgroundColor: '#334155',
    }, { fontSize: '21px', padding: { x: 28, y: 12 } });
    confirm.on('pointerdown', () => handlers.onSubmit?.(AUTH_MODES.guestConfirm));
    cancel.on('pointerdown', () => handlers.onModeChange?.(AUTH_MODES.entry));
    return { overlay, popup, title, body, confirm, cancel };
  }

  static renderField(scene, card, label, index, fieldCount) {
    const fieldHeight = 54;
    const gap = 14;
    const firstY = card.y - ((fieldCount - 1) * (fieldHeight + gap)) / 2 - 14;
    const y = firstY + index * (fieldHeight + gap);
    const field = createPanelBackground(scene, {
      x: card.x,
      y,
      width: 460,
      height: fieldHeight,
    }, { fillColor: 0xf8fafc });
    if (scene.add.dom) {
      const inputType = label === '비밀번호' ? 'password' : 'text';
      const maxLength = label === '8자리 인증코드' ? ' maxlength="8" inputmode="numeric"' : '';
      const input = scene.add.dom(card.x, y).createFromHTML(
        `<input type="${inputType}" aria-label="${label}" placeholder="${label}"${maxLength} style="width:460px;height:54px;box-sizing:border-box;border:0;border-radius:4px;padding:0 18px;font:22px sans-serif;color:#1e293b;background:#f8fafc;outline:3px solid #93c5fd;" />`,
      ).setOrigin(0.5);
      return { field, input };
    }
    const text = renderText(scene, card.x - 205, y, label, {
      fontSize: '22px', color: '#64748b',
    }, [0, 0.5]);
    return { field, text };
  }
}
