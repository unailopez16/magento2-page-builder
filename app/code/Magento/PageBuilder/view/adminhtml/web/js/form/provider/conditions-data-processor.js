/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'mage/utils/objects',
    'Magento_Rule/conditions-data-normalizer'
], function (_, objectUtils, ConditionsDataNormalizer) {
    'use strict';

    var serializer = new ConditionsDataNormalizer();

    return function (data, attribute) {
        var pairs = {};

        /*
         * The Condition Rule Tree is not a UI component and doesn't provide good data.
         * The best solution is to implement the tree as a UI component that can provide good data but
         * that is outside of the scope of the feature for now.
         */
        _.each(data, function (element, key) {
            // parameters is hardcoded in the Magento\Rule model that creates the HTML forms.
            if (key.indexOf('parameters[' + attribute + ']') === 0) {
                // Remove the bad, un-normalized data.
                delete data[key];

                pairs[key] = element;
            }
        });

        /*
         * Add pairs in case conditions source is not rules configurator
         */
        if (data.condition_option !== 'condition') {
            var conditionOperator = data[data.condition_option + '-condition_operator']
                ? data[data.condition_option + '-condition_operator']
                : "==";
            var conditionValue = typeof data[data.condition_option] === 'string'
                ? data[data.condition_option].trim()
                : '';
            pairs['parameters[' + attribute + '][1--1][operator]'] = conditionOperator;
            pairs['parameters[' + attribute + '][1--1][type]'] = "Magento\\CatalogWidget\\Model\\Rule\\Condition\\Product";
            pairs['parameters[' + attribute + '][1][aggregator]'] = "all";
            pairs['parameters[' + attribute + '][1][new_child]'] = "";
            pairs['parameters[' + attribute + '][1][type]'] = "Magento\\CatalogWidget\\Model\\Rule\\Condition\\Combine";
            pairs['parameters[' + attribute + '][1][value]'] = "1";
            pairs['parameters[' + attribute + '][1--1][attribute]'] = data.condition_option;
            pairs['parameters[' + attribute + '][1--1][value]'] = conditionValue;
        }

        if (!_.isEmpty(pairs)) {
            var conditions = JSON.stringify(serializer.normalize(pairs).parameters[attribute]);
            data['conditions_encoded'] = conditions;
            objectUtils.nested(data,attribute, conditions);
        }
    };
});
