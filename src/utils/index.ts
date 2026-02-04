export const labelOptions = (index: number) => {
   return String.fromCharCode(65 + index) + ".";
}

export const capitalizeFirstLetter = (value: string) => {
   return value.charAt(0).toUpperCase() + value.slice(1);
};