import EditorJS from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';

import Snackbar from "../components/snackbar";

const saveBtn = document.querySelector('.js-save-about-text-btn');
const el = document.querySelector('.js-about-text');
const data = el ? JSON.parse(el.dataset.content) : '';
const editor = null;
const updatedSettingsSnackbar = new Snackbar();

if (saveBtn && el) {
  const editor = new EditorJS({
    data: data,
    holder: 'js-about-text',
    autofocus: true,
    placeholder: 'Write here...',
    inlineToolbar: ['bold', 'italic', 'link'],
    tools: {
      header: {
        class: Header,
        levels: [1, 2, 4],
        defaultLevel: 1,
        inlineToolbar: ['bold', 'italic', 'link'],
      },
      paragraph: {
        class: Paragraph,
        levels: 1,
        inlineToolbar: ['bold', 'italic', 'link']
      },
      embed: {
        class: Embed,
        config: {
          services: {
            youtube: true,
            coub: true,
            facebook: true,
          }
        }
      },
    }
  });

  const coinId = document.querySelector('.js-coin-id').value;
  const locationOrigin = window.location.origin;
  saveBtn.addEventListener('click', () => {
    editor.save().then((outputData) => {
      const dataDefault = '{"about": null}';
      const requestOptions = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: (outputData.hasOwnProperty('blocks') && outputData.blocks.length > 0) ?
          JSON.stringify({
            about: outputData,
          }) :
          dataDefault,
      };
      fetch(
        `${locationOrigin}/v2/api/coins/${coinId}/settings/about`,
        requestOptions
      )
        .then(() => {
          updatedSettingsSnackbar.addMessage(
            'success',
            'Settings successfully updated'
          );
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    });
  });
}

export default editor;
