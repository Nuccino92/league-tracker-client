import { SportType } from '@/app/lib/types/sport.types';

type SportsDictionary = {
  [key in SportType]: string;
};

const sportsDictionary: SportsDictionary = {
  basketball: 'Basketball',
  baseball: 'Baseball',
  soccer: 'Soccer',
  hockey: 'Hockey',
  curling: 'Curling',
  football: 'Football',
  volleyball: 'Volleyball',
  // tennis: 'Tennis',
  rugby: 'Rugby',
  lacross: 'Lacrosse',
  'field-hockey': 'Field Hockey',
};

export default sportsDictionary;
