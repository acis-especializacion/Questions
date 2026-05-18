export const labelOptions = (index: number) => {
   return String.fromCharCode(65 + index) + ".";
}

export const capitalizeFirstLetter = (value: string) => {
   return value.charAt(0).toUpperCase() + value.slice(1);
};

const TEACHERS_KEY = 'docentes';

export const getTeachers = (): { id: string; name: string }[] => {
   const data = localStorage.getItem(TEACHERS_KEY);
   return data ? JSON.parse(data) : [];
};

export const saveTeachers = (teachers: { id: string; name: string }[]): void => {
   localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
};

export const hasTeachers = (): boolean => {
   return getTeachers().length > 0;
};