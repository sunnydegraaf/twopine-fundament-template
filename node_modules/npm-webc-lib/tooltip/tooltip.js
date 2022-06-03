const template = document.createElement('template');
template.innerHTML = `
    <style>
        .cancel {
            display: none;
        }

        svg {
            width: 1em;
            cursor: pointer;
            fill: var(--primary);
        }

        .tooltip-container {
            display: inline-block;
            position: relative;
            z-index: 2;
        }

        .notify-container {
            position: absolute;
            bottom: 125%;
            z-index: 9;
            width: 300px;
            background: var(--primary);
            color: var(--main-typo-color)
            box-shadow: 5px 5px 10px rgba(0, 0, 0, .1);
            font-size: .8em;
            border-radius: 1em;
            padding: .5em 1em;
            transform: scale(0);
            transform-origin: bottom left;
            transition: transform .5s cubic-bezier(0.860, 0.000, 0.070, 1.000);
        } 
    </style>

    <div class="tooltip-container">
        <svg class="alert" version="1.1" x="0px" y="0px" viewBox="0 0 493.636 493.636" style="enable-background:new 0 0 493.636 493.636;" xml:space="preserve">
            <g>
                <path d="M421.428,72.476C374.868,25.84,312.86,0.104,246.724,0.044C110.792,0.044,0.112,110.624,0,246.548
                    c-0.068,65.912,25.544,127.944,72.1,174.584c46.564,46.644,108.492,72.46,174.4,72.46h0.58v-0.048
                    c134.956,0,246.428-110.608,246.556-246.532C493.7,181.12,468,119.124,421.428,72.476z M257.516,377.292
                    c-2.852,2.856-6.844,4.5-10.904,4.5c-4.052,0-8.044-1.66-10.932-4.516c-2.856-2.864-4.496-6.852-4.492-10.916
                    c0.004-4.072,1.876-8.044,4.732-10.884c2.884-2.86,7.218-4.511,11.047-4.542c3.992,0.038,7.811,1.689,10.677,4.562
                    c2.872,2.848,4.46,6.816,4.456,10.884C262.096,370.46,260.404,374.432,257.516,377.292z M262.112,304.692
                    c-0.008,8.508-6.928,15.404-15.448,15.404c-8.5-0.008-15.42-6.916-15.416-15.432L231.528,135
                    c0.004-8.484,3.975-15.387,15.488-15.414c4.093,0.021,7.895,1.613,10.78,4.522c2.912,2.916,4.476,6.788,4.472,10.912
                    L262.112,304.692z"/>
            </g>
        </svg>
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

        <div class="notify-container">
            <slot name="message" />
        </div>
    </div>
`

class Tooltip extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:'open'})
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
    
    tooltip(expandState) {
        const tooltip = this.shadowRoot.querySelector('.notify-container');
        const alert = this.shadowRoot.querySelector('.alert');
        const cancel = this.shadowRoot.querySelector('.cancel');

        if(expandState == true) {
            tooltip.style.transform = 'scale(1)';
            alert.style.display = 'none';
            cancel.style.display = 'block';
            expandState = false;
        } else {
            tooltip.style.transform = 'scale(0)';
            cancel.style.display = 'none';
            alert.style.display = 'block'; 
        }

    }

    connectedCallback() {
        this.shadowRoot.querySelector('.alert').addEventListener('click', () => {
            this.tooltip(true);
        })
        this.shadowRoot.querySelector('.cancel').addEventListener('click', () => {
            this.tooltip(false);
        })

        if(this.getAttribute('tip_background')) {
            this.shadowRoot.querySelector('.notify-container').style.background = this.getAttribute('tip_background');
        }

        if(this.getAttribute('tip_color')) {
            this.shadowRoot.querySelector('.notify-container').style.color = this.getAttribute('tip_color');
        }
    }
}

window.customElements.define('tooltip-modal', Tooltip);