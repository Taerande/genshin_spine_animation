import { BaseComponent } from "./baseComponent";

class Modal extends BaseComponent {
  constructor(element) {
    super(element);
    this._isOpen = false;
  }

  open() {
    this._isOpen = true;
    this.element.style.display = "block";
  }

  close() {
    this._isOpen = false;
    this.element.style.display = "none";
  }
}
