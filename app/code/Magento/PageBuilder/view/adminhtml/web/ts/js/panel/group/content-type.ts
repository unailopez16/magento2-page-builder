/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import ContentTypeConfigInterface from "../../content-type-config.d";

export class ContentType {
    public droppable: boolean = true;
    private config: ContentTypeConfigInterface;
    private icon: KnockoutObservable<string> = ko.observable("");
    private identifier: KnockoutObservable<string> = ko.observable("");
    private label: KnockoutObservable<string> = ko.observable("");

    /**
     * @param {string} identifier
     * @param {ContentTypeConfigInterface} config
     */
    constructor(identifier: string, config: ContentTypeConfigInterface) {
        this.config = config;
        this.identifier(identifier);
        this.label(config.label);
        this.icon(config.icon);
    }

    /**
     * Retrieve the config object
     *
     * @returns {ContentTypeConfigInterface}
     */
    public getConfig() {
        return this.config;
    }

    /**
     * Return the draggable config to the element
     *
     * @returns {string}
     */
    public getDraggableConfig() {
        return this.config.allowed_parents.map((value, index) => "." + value + "-container").join(", ");
    }
}