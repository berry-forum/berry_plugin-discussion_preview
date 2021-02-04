/*global s9e, $*/

import TextEditor from 'flarum/components/TextEditor';
import ComposerBody from 'flarum/components/ComposerBody';
import DiscussionComposer from 'flarum/components/DiscussionComposer';
import {extend} from 'flarum/extend';

app.initializers.add('preview-discussion', () => {
    let index = 1;
    let previewMode = false;
    const previewItemName = 'preview-discussion';
    const previewClassName = `.item-${previewItemName}`;

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

    extend(TextEditor.prototype, 'controlItems', function (items) {
        items.add(previewItemName, <div>Loading Preview</div>, 50);
        if (previewMode) {
            s9e.TextFormatter.preview(this.value, $(previewClassName));
            $(previewClassName).show();
        } else {
            $(previewClassName).hide();
        }
    });
});
