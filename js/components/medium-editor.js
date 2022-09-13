import Delimiter from '@editorjs/delimiter';
import EditorJS from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import Table from '@editorjs/table';
import Underline from '@editorjs/underline';
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';

class Editor{
  constructor(tag = null, options = null) {
    if (!tag) {
      throw new Error('Editor tag was not provided');
    }
    function getDefaultOptions() {
      return {
        /**
         * Id of Element that should contain Editor instance
         */
        holder: 'blog',
        placeholder: 'Write here...',
        tools: {
          header: {
            class: Header,
            levels: [2, 3],
            inlineToolbar: true,
            tunes: ['tune'],
          },
          list: {
            class: List,
            inlineToolbar: true,
            tunes: ['tune'],
          },
          table2: {
            class: Table,
            tunes: ['tune'],
            config: {
              rows: 2,
              cols: 2,
            },
          },
          table3: {
            class: Table,
            tunes: ['tune'],
            config: {
              rows: 2,
              cols: 3,
            },
          },
          table4: {
            class: Table,
            tunes: ['tune'],
            config: {
              rows: 2,
              cols: 4,
            },
          },
          delimiter: {
            class: Delimiter,
            inlineToolbar: true,
            tunes: ['tune'],
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            tunes: ['tune'],
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                coub: true,
                facebook: true,
              },
            },
          },
          simpleImage: SimpleImage,
          underline: Underline,
          image: {
            class: ImageTool,
            inlineToolbar: true,
            config: {
              uploader: {
                uploadByFile: null,
              },
            },
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            tunes: ['tune'],
          },
          tune: {
            class: AlignmentTuneTool,
            config: {
              default: 'left',
              blocks: {
                header: 'left',
                list: 'left',
              },
            },
          },
        },
      };
    }
    this.options = getDefaultOptions();
    if (options.uploadCallback) {
      this.options.tools.image.config.uploader.uploadByFile =
        options.uploadCallback;
    }
    if (options.onReady) {
      this.options.onReady = options.onReady;
    }
    this.options = { ...this.options, holder: tag };
    if (options.data !== null) {
      this.options = { ...this.options, data: options.data };
    }
    if (options.readOnly !== null) {
      this.options.readOnly = true;
    }

    this.editor = new EditorJS(this.options);
  }

  save() {
    return this.editor.save();
  }

  isReady() {
    return this.editor.isReady;
  }
}

export default Editor;
