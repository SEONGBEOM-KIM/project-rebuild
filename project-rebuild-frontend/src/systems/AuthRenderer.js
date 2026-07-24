import AuthViewManager, { AUTH_MODES } from './AuthViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';
import { createTextButton } from '../ui/TextButton.js';

const renderText = (scene, x, y, text, style, origin = 0.5) => createLayoutText(scene, { x, y, text }, { style, origin });

export default class AuthRenderer {
  static renderAuthScreen(scene, width, height, mode, handlers = {}) {
    const layout = AuthViewManager.getLayout();
    const activeMode = AuthViewManager.getMode(mode);
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

    if (mode === AUTH_MODES.guest) {
      objects.guestNote = renderText(scene, card.x, card.y - 62, '진행 상황은 임시 코드와 함께 저장됩니다.', {
        fontSize: '26px', color: '#fef3c7', fontStyle: 'bold',
      });
      objects.guestIcon = scene.add.circle(card.x, card.y + 24, 42, 0xfbbf24);
      objects.guestIcon.setStrokeStyle(4, 0xfef3c7);
    } else {
      activeMode.fields.forEach((field, index) => {
        objects[`field${index}`] = AuthRenderer.renderField(scene, card, field, index, activeMode.fields.length);
      });
    }

    const submitY = mode === AUTH_MODES.guest ? card.y + 132 : card.y + 178;
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

    if (mode !== AUTH_MODES.guest) {
      objects.guestButton = createTextButton(scene, {
        ...AuthViewManager.getGuestButton(width),
        textColor: '#fef3c7', backgroundColor: '#422006',
      }, { fontSize: '20px', padding: { x: 20, y: 10 } });
      objects.guestButton.on('pointerdown', () => handlers.onModeChange?.(AUTH_MODES.guest));
    }

    return objects;
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
    const text = renderText(scene, card.x - 205, y, label, {
      fontSize: '22px', color: '#64748b',
    }, [0, 0.5]);
    return { field, text };
  }
}
