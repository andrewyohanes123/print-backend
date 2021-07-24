import createModels from '../src/models';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import ModelFactoryInterface from '../src/models/typings/ModelFactoryInterface';

dotenv.config();

(async (): Promise<void> => {
  const models: ModelFactoryInterface = createModels();
  await models.User.create({
    name: 'Admin',
    username: 'admin',
    password: bcrypt.hashSync('admin', 10),
  });
  console.log('(create:default-user) Username : admin, Password : admin');
})()
  .then(() => {
    console.log('(create:default-user) done');
    process.exit(0);
  })
  .catch((err: Error) => {
    console.warn('(create:default-user) error : ' + err.message);
    process.exit(0);
  });