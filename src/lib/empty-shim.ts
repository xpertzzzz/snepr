// Browser shim for server-only Node libraries
export const OAuth2Client = class {
  verifyIdToken() {
    return Promise.resolve({ getPayload: () => ({ email: "", name: "" }) });
  }
};

export const createTransport = () => ({
  sendMail: () => Promise.resolve({ messageId: "mock" }),
});

export const compare = () => Promise.resolve(true);
export const hash = () => Promise.resolve("");
export const sign = () => "mock_token";
export const verify = () => ({});

const emptyDefault: any = {
  OAuth2Client,
  createTransport,
  compare,
  hash,
  sign,
  verify,
};

export default emptyDefault;

