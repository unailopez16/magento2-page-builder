/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../config";
import EventBus from "../event-bus";
import Block from "./block";

export default class ProductList extends Block {

    /**
     * Bind events for the current instance
     */
    protected bindEvents() {
        super.bindEvents();

        EventBus.on("previewObservables:updated", (event, params) => {
            if (params.preview.id === this.id) {
                const attributes = this.data.main.attributes();
                if (attributes["data-category-id"] === "") {
                    return;
                }
                const url = Config.getInitConfig("preview_url");
                const requestData = {
                    is_preview: true,
                    role: this.config.name,
                    category_id: attributes["data-category-id"],
                    hide_out_of_stock: attributes["data-hide-out-of-stock"],
                    product_count: attributes["data-product-count"],
                };

                jQuery.post(url, requestData, (response) => {
                    this.data.main.html(response.content !== undefined ? response.content.trim() : "");
                });
            }
        });
    }
}