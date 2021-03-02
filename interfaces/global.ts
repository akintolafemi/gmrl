export interface NetworkResponse {
  statuscode: number;
  responsemessage?: string;
  responsecode?: string;
  exception?: string;
}

export interface ReferralResponse {
  email?: string;
  code: string;
  referrer?: string;
}

export enum BIOMETRY_TYPE {
  TOUCH_ID = 'TouchID',
  FACE_ID = 'FaceID',
  FINGERPRINT = 'Fingerprint',
  FACE = 'Face',
  IRIS = 'Iris',
}

export interface BanksSuccessResponse extends NetworkResponse {
  data: Array<Bank>;
}

export interface LoginResponse extends NetworkResponse {
  data: Object<any>;
}

export interface ValidateResponse extends NetworkResponse {
  data: {isValid: boolean};
}
