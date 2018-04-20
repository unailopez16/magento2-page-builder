/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import {ContentTypeConfigInterface} from "../../../content-type-config.d";
import createContentType from "../../../content-type-factory";
import {ContentTypeInterface} from "../../../content-type.d";
import ObservableUpdater from "../../../observable-updater";
import PreviewCollection from "../../../preview-collection";
import BlockMountEventParamsInterface from "../../block/block-mount-event-params.d";
import Config from "../../config";
import EventBus from "../../event-bus";
import {StyleAttributeMapperResult} from "../../format/style-attribute-mapper";
import {Option} from "../../stage/structural/options/option";
import {OptionInterface} from "../../stage/structural/options/option.d";
import ColumnGroup from "./column-group";
import {getMaxColumns} from "./column-group/resizing";

export default class Column extends PreviewCollection {
    public resizing: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(parent, config, observableUpdater);
        this.previewData.width.subscribe((newWidth) => {
            const maxColumns = getMaxColumns();
            newWidth = parseFloat(newWidth);
            newWidth = Math.round(newWidth / (100 / maxColumns));
            const newLabel = `${newWidth}/${maxColumns}`;
            const column = $t("Column");
            this.displayLabel(`${column} ${newLabel}`);
        });

    }

    /**
     * Bind events for the current instance
     */
    public bindEvents() {
        super.bindEvents();

        if (Config.getContentTypeConfig("column-group")) {
            EventBus.on("column:block:mount", (event: Event, params: BlockMountEventParamsInterface) => {
                if (params.id === this.parent.id) {
                    this.createColumnGroup();
                }
            });
        }
    }

    /**
     * Make a reference to the element in the column
     *
     * @param element
     */
    public initColumn(element: Element) {
        this.parent.element = $(element);
        EventBus.trigger("column:initElement", {
            column: this.parent,
            element: $(element),
            parent: this.parent.parent,
        });
    }

    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */
    public retrieveOptions(): OptionInterface[] {
        const options = super.retrieveOptions();
        const newOptions = options.filter((option) => {
            return (option.code !== "move");
        });
        newOptions.unshift(
            new Option(
                this,
                "move",
                "<i class='icon-admin-pagebuilder-handle'></i>",
                $t("Move"),
                null,
                ["move-column"],
                10,
            ),
        );
        return newOptions;
    }

    /**
     * Init the resize handle for the resizing functionality
     *
     * @param handle
     */
    public bindResizeHandle(handle: Element) {
        EventBus.trigger("column:bindResizeHandle", {
            column: this.parent,
            handle: $(handle),
            parent: this.parent.parent,
        });
    }

    /**
     * Wrap the current column in a group if it not in a column-group
     *
     * @returns {Promise<ContentTypeInterface>}
     */
    public createColumnGroup(): Promise<ContentTypeInterface> {
        if (this.parent.parent.config.name !== "column-group") {
            const index = this.parent.parent.children().indexOf(this.parent);
            // Remove child instantly to stop content jumping around
            this.parent.parent.removeChild(this.parent);
            // Create a new instance of column group to wrap our columns with
            return createContentType(
                Config.getContentTypeConfig("column-group"),
                this.parent.parent,
                this.parent.stageId,
            ).then((columnGroup: ColumnGroup) => {
                return Promise.all([
                    createContentType(this.parent.config, columnGroup, columnGroup.stageId, {width: "50%"}),
                    createContentType(this.parent.config, columnGroup, columnGroup.stageId, {width: "50%"}),
                ]).then((columns: [Column, Column]) => {
                    columnGroup.addChild(columns[0], 0);
                    columnGroup.addChild(columns[1], 1);
                    this.parent.parent.addChild(columnGroup, index);

                    this.fireMountEvent(columnGroup, columns[0], columns[1]);

                    return columnGroup;
                });
            });
        }
    }

    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */
    protected afterStyleMapped(styles: StyleAttributeMapperResult) {
        // Extract data values our of observable functions
        // The style attribute mapper converts images to directives, override it to include the correct URL
        if (this.previewData.background_image && typeof this.previewData.background_image()[0] === "object") {
            styles.backgroundImage = "url(" + this.previewData.background_image()[0].url + ")";
        }

        // If we have left and right margins we need to minus this from the total width
        if (this.previewData.margins_and_padding && this.previewData.margins_and_padding().margin) {
            const margins = this.previewData.margins_and_padding().margin;
            const horizontalMargin = parseInt(margins.left || 0, 10) +
                parseInt(margins.right || 0, 10);
            styles.width = "calc(" + styles.width + " - " + horizontalMargin + "px)";
        }

        // If the right margin is 0, we set it to 1px to overlap the columns to create a single border
        if (styles.marginRight === "0px") {
            styles.marginRight = "1px";
        }

        // If the border is set to default we show no border in the admin preview, as we're unaware of the themes styles
        if (this.previewData.border && this.previewData.border() === "_default") {
            styles.border = "none";
        }

        return styles;
    }

    /**
     * Fire the mount event for blocks
     *
     * @param {ContentTypeInterface[]} blocks
     */
    private fireMountEvent(...blocks: ContentTypeInterface[]) {
        blocks.forEach((block) => {
            EventBus.trigger("block:mount", {id: block.id, block});
            EventBus.trigger(block.config.name + ":block:mount", {id: block.id, block});
        });
    }
}
