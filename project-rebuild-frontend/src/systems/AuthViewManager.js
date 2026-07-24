import SCENE_KEYS from '../data/sceneKeys.js';

export const AUTH_MODES = Object.freeze({
  teacherLogin: 'teacherLogin',
  teacherSignup: 'teacherSignup',
  teacherRecovery: 'teacherRecovery',
  studentCode: 'studentCode',
  guest: 'guest',
});

export const AUTH_LAYOUT = Object.freeze({
  backgroundColor: 0x0b1727,
  title: { y: 118, text: '푸른군에 입장하기', fontSize: '58px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 184, text: '수업 코드를 입력하거나, 교사 계정으로 학습을 이어가세요.', fontSize: '24px', color: '#bfdbfe' },
  card: {
    x: 960,
    y: 505,
    width: 760,
    height: 590,
    fillColor: 0x172554,
    strokeColor: 0x60a5fa,
    strokeWidth: 3,
  },
  modeRail: { x: 960, y: 270, width: 760, height: 64, fillColor: 0x0f1f3d },
  modes: [
    { id: AUTH_MODES.teacherLogin, label: '교사 로그인', shortLabel: '교사' },
    { id: AUTH_MODES.studentCode, label: '학생 코드', shortLabel: '학생' },
    { id: AUTH_MODES.guest, label: '게스트', shortLabel: '게스트' },
  ],
  modeStyle: {
    fontSize: '22px',
    activeColor: '#1d4ed8',
    inactiveColor: '#1e3a5f',
    textColor: '#dbeafe',
  },
  modeContent: {
    [AUTH_MODES.teacherLogin]: {
      title: '교사 로그인',
      description: '수업을 열고 학생들의 학습 진행을 관리합니다.',
      fields: ['아이디', '비밀번호'],
      submitLabel: '로그인',
      helperLabel: '아이디·비밀번호 찾기',
    },
    [AUTH_MODES.teacherSignup]: {
      title: '교사 회원가입',
      description: '교사 계정을 만들고 학생용 인증코드를 발급하세요.',
      fields: ['이메일', '학교 이름', '아이디', '비밀번호'],
      submitLabel: '교사 계정 만들기',
      helperLabel: '이미 계정이 있다면 로그인',
    },
    [AUTH_MODES.teacherRecovery]: {
      title: '교사 계정 찾기',
      description: '가입할 때 사용한 이메일로 계정 찾기 안내를 받을 수 있습니다.',
      fields: ['가입 이메일'],
      submitLabel: '찾기 안내 보내기',
      helperLabel: '교사 로그인으로 돌아가기',
    },
    [AUTH_MODES.studentCode]: {
      title: '학생 인증코드로 입장',
      description: '교사에게 받은 8자리 숫자 코드를 입력하세요.',
      fields: ['8자리 인증코드'],
      submitLabel: '학습 시작하기',
      helperLabel: '코드를 잊었다면 교사에게 다시 요청하세요.',
    },
    [AUTH_MODES.guest]: {
      title: '게스트로 시작',
      description: '교사 없이도 임시 코드로 학습을 시작할 수 있습니다.',
      fields: [],
      submitLabel: '임시 코드 발급받기',
      helperLabel: '임시 코드는 이 기기에서 다시 입장할 때 필요합니다.',
    },
  },
  footer: { y: 918, text: '학생은 회원가입 없이 8자리 인증코드로 참여합니다.', fontSize: '20px', color: '#94a3b8' },
  targetScene: SCENE_KEYS.Story,
});

export default class AuthViewManager {
  static getLayout() {
    return AUTH_LAYOUT;
  }

  static getMode(mode = AUTH_MODES.teacherLogin) {
    return AUTH_LAYOUT.modeContent[mode] ?? AUTH_LAYOUT.modeContent[AUTH_MODES.teacherLogin];
  }

  static getModeTabs(width, activeMode = AUTH_MODES.teacherLogin) {
    const rail = AUTH_LAYOUT.modeRail;
    const tabWidth = rail.width / AUTH_LAYOUT.modes.length;
    return AUTH_LAYOUT.modes.map((mode, index) => ({
      ...mode,
      x: width / 2 - rail.width / 2 + tabWidth * index + tabWidth / 2,
      y: rail.y,
      width: tabWidth - 8,
      active: mode.id === activeMode,
    }));
  }

  static getSignupButton(width) {
    return { x: width / 2, y: 770, label: '처음이라면 교사 회원가입', targetMode: AUTH_MODES.teacherSignup };
  }

  static getGuestButton(width) {
    return { x: width / 2, y: 838, label: '교사 없이 게스트로 시작', targetMode: AUTH_MODES.guest };
  }

  static getFooter(width) {
    return { ...AUTH_LAYOUT.footer, x: width / 2 };
  }
}
