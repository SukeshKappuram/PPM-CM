export interface IButton {
  id: string;
  name: string;
  label: string;
  icon: string;
  isDropdown: boolean;
  dropdownList: string[];
  isDisabled?: boolean;
  fill: boolean;
}
