/*global s9e, $*/

import TextEditor from 'flarum/components/TextEditor';
import Composer from 'flarum/components/Composer';
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
        console.log(vdom);
    });

    extend(TextEditor.prototype, 'oninput', function () {
        $(`${previewClassName} > div`).each((_, dom) => {
            s9e.TextFormatter.preview(this.value(), dom);
        });
    });

    extend(ComposerBody.prototype, 'headerItems', function (items) {
        items.add(previewItemName, <div>Loading Preview</div>, 50);
        $(`${previewClassName} > div`).addClass("Post-body");
        if (previewMode) {
            $(previewClassName).fadeIn();
        } else {
            $(previewClassName).hide();
        }
    });

    extend(Composer.prototype, 'view', function (vdom) {
        console.log(vdom);
        $(`${previewClassName} > div`).css();
    });
});
