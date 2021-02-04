/*global s9e, jQuery*/

import TextEditor from 'flarum/components/TextEditor';
import ComposerBody from 'flarum/components/ComposerBody';
import DiscussionComposer from 'flarum/components/DiscussionComposer';
import {extend} from 'flarum/extend';

app.initializers.add('preview-discussion', () => {
    let index = 1;
    let previewMode = false;
    const previewClassName = 'preview-discussion';

    extend(DiscussionComposer.prototype, 'init', function () {
        this.editor.props.preview = () => {
            previewMode = !previewMode;
        };
    });

    extend(TextEditor.prototype, 'init', function () {
        this.textareaId = 'textarea' + (index++);
    });

    extend(TextEditor.prototype, 'view', function (vdom) {
        // Check id to avoid conflicts with markdown extension
        if (!vdom.children[0].attrs.id) {
            vdom.children[0].attrs.id = this.textareaId;
        }
    });

    extend(TextEditor.prototype, 'oninput', function () {
        previewDOM.each(dom => s9e.TextFormatter.preview(this.value, dom));
    });

    extend(ComposerBody.prototype, 'headerItems', function (items) {
        items.add(previewClassName, <div>Loading Preview</div>, 50);
        if (previewMode) {
            jQuery(`.${previewClassName}`).show();
        } else {
            jQuery(`.${previewClassName}`).hide();
        }
    });
});
