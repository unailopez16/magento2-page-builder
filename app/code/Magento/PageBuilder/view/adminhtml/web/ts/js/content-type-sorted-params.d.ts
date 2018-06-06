/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeInterface from "./content-type.d";

export default interface ContentTypeSortedParamsInterface {
    parent: ContentTypeInterface;
    contentType: ContentTypeInterface;
    index: number;
    stageId: string;
}