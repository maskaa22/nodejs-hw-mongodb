import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserCollection } from '../db/models/users.js';
import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/sessions.js';
import { APP_DOMAIN, FIFTEEN_MINUTES, JWT_SECRET, ONE_DAY, SMTP, TEMPLATES_DIR } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';

const createToken = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');

  const hashPassword = await bcrypt.hash(payload.password, 10);
  return await UserCollection.create({ ...payload, password: hashPassword });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  if (!user) throw createHttpError(401, 'User not found');

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  } = createToken();

  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};

export const refreshUserToken = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createToken();

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (_id) => {
  return await SessionCollection.deleteOne({ _id });
};

export const sendEmailForPassword = async (email) => {
  const user = await UserCollection.findOne({email});

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign({
    sub: user._id,
    email
  },
  getEnvVar(JWT_SECRET),
  {
    expiresIn: '5m'
  });

  const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html',);

  const templateSource = ( await fs.readFile(resetPasswordTemplatePath)).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar(APP_DOMAIN)}/reset-password?token=${resetToken}`,
  });

  const send = await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });

  if (!send) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async(payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar(JWT_SECRET));

    
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
    throw err.message; 
  }

  const user = await UserCollection.findOne({
    _id: entries.sub,
    email: entries.email,
  });

  if(!user) throw createHttpError(404, 'User not found');

  const hashPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne({_id: user._id}, {password: hashPassword});
};