/**
 * 专升本备考APP - 软件激活系统
 * 防传播机制：设备指纹 + 激活码验证
 * 算法：HMAC-like XOR + Base64 编码
 */

const LicenseSystem = {
  // 内置密钥种子（打包时固定）
  SECRET_SEED: 'AHUT-CourseCram-2026-Engineering-Mechanics-Surveying',

  /**
   * 生成设备指纹（机器码）
   * 基于设备特征生成唯一标识
   */
  getMachineCode() {
    const info = [
      navigator.hardwareConcurrency || 4,
      screen.width + 'x' + screen.height,
      navigator.language,
      new Date().getTimezoneOffset(),
      navigator.platform || 'unknown',
      !!navigator.onLine
    ].join('|');
    return this._hash(info).substring(0, 16).toUpperCase();
  },

  /**
   * 简易哈希函数
   */
  _hash(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0);
    return hash.toString(36).toUpperCase() + h2.toString(36).toUpperCase();
  },

  /**
   * 生成激活码（仅供卖家使用 - keygen工具中实现）
   * 此处为验证逻辑
   */
  validateLicense(machineCode, licenseKey) {
    try {
      if (!licenseKey || licenseKey.length < 8) return { valid: false, msg: '激活码格式错误' };
      const decoded = this._decode(licenseKey);
      if (!decoded) return { valid: false, msg: '激活码无效' };
      const parts = decoded.split(':');
      if (parts.length !== 4) return { valid: false, msg: '激活码无效' };
      const [mc, expiry, type, checksum] = parts;
      // 验证校验和
      const expected = this._checksum(mc + expiry + type);
      if (checksum !== expected) return { valid: false, msg: '激活码校验失败（可能被篡改）' };
      // 验证机器码
      if (mc !== machineCode && type !== 'U') return { valid: false, msg: '激活码与当前设备不匹配' };
      // 验证有效期
      const expDate = parseInt(expiry);
      if (expDate > 0 && Date.now() > expDate) return { valid: false, msg: '激活码已过期' };
      const daysLeft = expDate > 0 ? Math.ceil((expDate - Date.now()) / 86400000) : 9999;
      return {
        valid: true,
        msg: type === 'U' ? '通用激活码 - 永久有效' : `激活成功！剩余 ${daysLeft} 天`,
        expiry: expDate,
        type: type
      };
    } catch (e) {
      return { valid: false, msg: '激活码解析失败' };
    }
  },

  /**
   * 编码 (XOR + Base64)
   */
  _encode(plain) {
    let result = '';
    const key = this.SECRET_SEED;
    for (let i = 0; i < plain.length; i++) {
      const cc = plain.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(cc);
    }
    return btoa(result).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },

  /**
   * 解码 (Base64 + XOR)
   */
  _decode(encoded) {
    try {
      let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const raw = atob(b64);
      let result = '';
      const key = this.SECRET_SEED;
      for (let i = 0; i < raw.length; i++) {
        result += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch (e) {
      return null;
    }
  },

  /**
   * 校验和
   */
  _checksum(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum = ((sum << 5) - sum) + str.charCodeAt(i);
      sum |= 0;
    }
    return Math.abs(sum).toString(16).toUpperCase().padStart(4, '0');
  },

  /**
   * 获取已保存的激活状态
   */
  getSavedLicense() {
    try {
      return {
        key: localStorage.getItem('_lc_key') || '',
        machineCode: localStorage.getItem('_lc_mc') || this.getMachineCode(),
        activated: localStorage.getItem('_lc_activated') === '1',
        expiry: parseInt(localStorage.getItem('_lc_expiry') || '0'),
        type: localStorage.getItem('_lc_type') || ''
      };
    } catch (e) {
      return { key: '', machineCode: this.getMachineCode(), activated: false, expiry: 0, type: '' };
    }
  },

  /**
   * 保存激活状态
   */
  saveLicense(machineCode, licenseKey, result) {
    try {
      localStorage.setItem('_lc_key', licenseKey);
      localStorage.setItem('_lc_mc', machineCode);
      localStorage.setItem('_lc_activated', '1');
      localStorage.setItem('_lc_expiry', String(result.expiry));
      localStorage.setItem('_lc_type', result.type);
    } catch (e) { /* quota exceeded, ignore */ }
  },

  /**
   * 清除激活状态
   */
  clearLicense() {
    try {
      localStorage.removeItem('_lc_key');
      localStorage.removeItem('_lc_mc');
      localStorage.removeItem('_lc_activated');
      localStorage.removeItem('_lc_expiry');
      localStorage.removeItem('_lc_type');
    } catch (e) { /* ignore */ }
  },

  /**
   * 检查试用状态
   */
  getTrialInfo() {
    try {
      const start = parseInt(localStorage.getItem('_trial_start') || '0');
      const days = parseInt(localStorage.getItem('_trial_days') || '0');
      if (!start) {
        const now = Date.now();
        localStorage.setItem('_trial_start', String(now));
        return { inTrial: true, daysLeft: 3, totalDays: 3 };
      }
      const elapsed = Math.floor((Date.now() - start) / 86400000);
      const left = Math.max(0, 3 - elapsed);
      return { inTrial: left > 0, daysLeft: left, totalDays: 3, start: start };
    } catch (e) {
      return { inTrial: true, daysLeft: 3, totalDays: 3 };
    }
  }
};

// 导出
window.LicenseSystem = LicenseSystem;
