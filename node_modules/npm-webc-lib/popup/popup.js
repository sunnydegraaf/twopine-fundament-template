class popup extends HTMLElement {
    get visible() {
      return this.hasAttribute("visible");
    }

    set visible(value) {
      if (value) {
        this.setAttribute("visible", "");
      } else {
        this.removeAttribute("visible");
      }
    }

    get title() {
      return this.getAttribute('title');
    }

    set title(value) {
      this.setAttribute('title', value);
    }

    constructor() {
      super();
    }

    connectedCallback() {
      this._render();
      this._attachEventHandlers();
    }

    static get observedAttributes() {
      return ["visible", "title"];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "title" && this.shadowRoot) {
        this.shadowRoot.querySelector(".title").textContent = newValue;
      }
      if (name === "visible" && this.shadowRoot) {
        if (newValue === null) {
          this.shadowRoot.querySelector(".wrapper").classList.remove("visible");
          this.dispatchEvent(new CustomEvent("close"));
        } else {
          this.shadowRoot.querySelector(".wrapper").classList.add("visible");
          this.dispatchEvent(new CustomEvent("open"))
        }
      }
    }

    _render() {
      const wrapperClass = this.visible ? "wrapper visible" : "wrapper";
      const container = document.createElement("div");
      container.innerHTML = `
        <style>
            svg {
                width: 1em;
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                fill: (--primary)
            }
            .wrapper {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0, 0.5);
                opacity: 0;
                visibility: hidden;
                transform: scale(1.1);
                transition: visibility 0s linear .25s,opacity .25s 0s,transform .25s;
                z-index: 1;
            }
          .visible {
            opacity: 1;
            visibility: visible;
            transform: scale(1);
            transition: visibility 0s linear 0s,opacity .25s 0s,transform .25s;
          }
          .modal {
            font-family: var(--font-family);
            font-size: var(--font-size);
            padding: 10px 10px 5px 10px;
            background-color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            border-radius: 2px;
            min-width: 300px;
            max-width: 600px;
          }
          .title {
            font-size: var(--font-size);
            margin-bottom: .5rem
          }
        </style>
        <div class='${wrapperClass}'>
          <div class='modal'>
            <svg class="cancel" version="1.1" x="0px" y="0px" viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve">
                <g>
                    <path id="XMLID_29_" d= "M165,0C120.926,0,79.492,17.163,48.328,48.327c-64.334,64.333-64.334,169.011-0.002,233.345
                        C79.49,312.837,120.926,330,165,330c44.072,0,85.508-17.163,116.672-48.328c64.334-64.334,64.334-169.012,0-233.345
                        C250.508,17.163,209.072,0,165,0z M239.246,239.245c-2.93,2.929-6.768,4.394-10.607,4.394c-3.838,0-7.678-1.465-10.605-4.394
                        L165,186.213l-53.033,53.033c-2.93,2.929-6.768,4.394-10.607,4.394c-3.838,0-7.678-1.465-10.605-4.394
                        c-5.859-5.857-5.859-15.355,0-21.213L143.787,165l-53.033-53.033c-5.859-5.857-5.859-15.355,0-21.213
                        c5.857-5.857,15.355-5.857,21.213,0L165,143.787l53.031-53.033c5.857-5.857,15.355-5.857,21.213,0
                        c5.859,5.857,5.859,15.355,0,21.213L186.213,165l53.033,53.032C245.104,223.89,245.104,233.388,239.246,239.245z"/>
                </g>
            </svg>
            <h2 class='title'>${this.title}</h2>
            <div class='content'>
              <slot></slot>
            </div>
          </div>
        </div>`;

      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(container);
    }

    _attachEventHandlers() {
      const cancelButton = this.shadowRoot.querySelector(".cancel");
      cancelButton.addEventListener('click', e => {
        this.dispatchEvent(new CustomEvent("cancel"))
        this.removeAttribute("visible");
      });
    }
  }
  window.customElements.define('popup-modal', popup);