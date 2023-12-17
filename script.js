'use strict';


const $ = selector => {
  const elements = [...document.querySelectorAll(selector)];
  
  return elements.length === 1 ? elements[0] : elements;
}


// custom function to create elements
const createElement = (tag, props, children) => {
   const element = document.createElement(tag);
  
  if (props) {
    for (let prop in props) {
      if (prop in element) element[prop] = props[prop];
      else element.setAttribute(prop, props[prop]);
    }
  }

  if (children) {
    [children].flat().forEach(child => {
      if (typeof child === 'string') {
        element.innerHTML += child;
        
        return
      }
      
      element.appendChild(child);
    });
  }
  
  return element;
}


class TodoApp { 
  constructor() {
    this.data = new Map([
      [Math.random(), 'Gabriel'],
    ]);
    
    // events
    $('form button').addEventListener('click', e => {
      e.preventDefault();
      this.add();
    });
    
    // dom
    this._input = $('input');
    this._list = $('ul');
    
    this._btn_edit = (id) => {
      const element = createElement('button', null, 'edit');
      
      const edit_fn = ({ target }) => {
        const text = this.get_li(id).querySelector('input');
        
        target.innerText = text.readOnly ? 'save' : ((() => {
          this.update(id);
          
          return 'edit';
        })());
        
        text.readOnly = !text.readOnly;
      }
      
      element.addEventListener('click', edit_fn);
      
      return element;
    }
    
    this._btn_delete = (id) => {
      const element = createElement('button', 
        null, 
        'delete'
      );
      
      const delete_fn = () => { 
        this.delete(id);
      }
      
      element.addEventListener('click', delete_fn);
      
      return element;
    }
    
    this._item = (data, id) => {
      // text
      const text = createElement('input', 
        { 
          type: 'text', 
          value: data, 
          readonly: 'readonly' 
        }
      );
      
      const actions = createElement('div',
        { className: 'actions'}, 
        [this._btn_edit(id), this._btn_delete(id)]
      );
      
      return createElement('li', 
        { 'data-id': id }, 
        [text, actions])
      };
    
    // utils
    this.get_li = (id) => {
      return [$('li')].flat().find(li => {
          return Number(li.dataset.id) === id;
      });
    }
    
    // init
    this.render();
  }
  
  render() { 
    this._list.innerHTML = '';
    
    this.data.forEach((data, key, index) => {
        this._list.appendChild(this._item(data, key));
    });
    
    // view data
    $('p').innerHTML = [...this.data].reduce((a, b) => {
      return `${a} ${b} </br>`;
    }, '');
    
    this.reset();
  }
  
  add() {
    if(this._input.value.trim()) {
      // check editig
      const inputs_text = [$("li input:not([readonly])")].flat();
      
      if (inputs_text.length >= 1) {
        alert('finish editing');
        
        return;
      }
      
      this.data.set(Math.random(), this._input.value.trim());
      
      this.render();
    }
  }
  
  update(id) {
    const value = this.get_li(id).querySelector('input').value;
    
    this.data.set(id, value);
  }
  
  delete(id) {
    this.data.delete(id);
    this.get_li(id).remove();
  }
  
  reset() {
    this._input.value = '';
  }
}

new TodoApp();