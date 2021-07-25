import createModels from '../src/models';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import ModelFactoryInterface from '../src/models/typings/ModelFactoryInterface';

dotenv.config();

const colors: {
  name: string;
  color: string;
}[] = [
  {
    name: 'Royal Blue',
    color: '#3f5fcc'
  },
  {
    name: 'Red',
    color: '#df3f41'
  },
  {
    name: 'Yellow',
    color: '#ebee42'
  },
  {
    name: 'Grey',
    color: '#494949'
  },
  {
    name: 'Green Forest',
    color: '#162617'
  },
  {
    name: 'Navy Blue',
    color: '#1d263b'
  },
  {
    name: 'Black',
    color: '#14181b'
  },
  {
    name: 'Tosca',
    color: '#23c998'
  },
  {
    name: 'Violet',
    color: '#310b3d'
  },
  {
    name: 'Maroon',
    color: '#912636'
  },
];

((): void => {
  const models: ModelFactoryInterface = createModels();
  colors.forEach(async (color, i: number) => {
    const col = await models.Color.create({...color});
    console.log(`Warna: ${col.name}`);
    if (colors.length === (i+1)) process.exit(0);
  });
})();