export interface ITheme {
  name: string;
  properties: any;
}

export const light: ITheme = {
  name: "light",
  properties: {
    "--themecolor": "#049aad",
    "--themecolor-dark": "#048b9c",
    "--themecolor-light": "#009daf38",
  }
};

export const dark: ITheme = {
  name: "dark",
  properties: {
    "--themecolor": "#3f51b5",
    "--themecolor-dark": "#354499",
    "--themecolor-light": "#3544993c",
  }
};
