import { Cpe } from './cpe';

export const uriBindingPrefix = 'cpe:/' as const;
export const formattedBindingPrefix = 'cpe:2.3:' as const;
export const uriBindingExtendedAttributesDelimiterKey = ':~' as const;

interface StringifyOptions {binding?: typeof uriBindingPrefix
    | typeof formattedBindingPrefix};

export class CpeParser {


    /**
     * Parse a cpe string value with either uri or formatted
     * binding.
     *
     * @param {string} cpe
     * @returns {Cpe}
     * @memberof CpeParser
     */
    parse(cpe: string): Cpe  {
        let trimmedCpe = cpe.trim();
        let substring = this.getCpeAttributesSubstring(trimmedCpe);
        let attributes = this.getAttributeList(trimmedCpe, substring);
        let cpeModel = new Cpe();
        for (let i = 0; i < attributes.length; i++) {
            let parsedAttributeValue = this.parseAttributeValue(attributes[i]);
            switch (i) {
                case 0:
                    cpeModel.part = parsedAttributeValue;
                    break;
                case 1:
                    cpeModel.vendor = parsedAttributeValue;
                    break;
                case 2:
                    cpeModel.product = parsedAttributeValue;
                    break;
                case 3:
                    cpeModel.version = parsedAttributeValue;
                    break;
                case 4:
                    cpeModel.update = parsedAttributeValue;
                    break;
                case 5:
                    cpeModel.edition = parsedAttributeValue;
                    break;
                case 6:
                    cpeModel.language = parsedAttributeValue;
                    break;
                case 7:
                    cpeModel.sw_edition = parsedAttributeValue;
                    break;
                case 8:
                    cpeModel.target_sw = parsedAttributeValue;
                    break;
                case 9:
                    cpeModel.target_hw = parsedAttributeValue;
                    break;
                case 10:
                    cpeModel.other = parsedAttributeValue;
            }
        }
        return cpeModel;
    }

    /**
     * Transform a Cpe instance into a string, without bindings
     *
     * @param {Cpe} cpe
     * @returns {string}
     * @memberof CpeParser
     */
    stringify(model: Cpe, options?: { prefix: 'formatted' | 'uri'}): string {
        const values = [model.part, model.vendor, model.product,model.version,model.update, model.edition, model.language,model.sw_edition,model.target_sw,model.target_hw,model.other].map(value => value && this.formatAttributeValue(value)).join(':');

        if(options?.prefix) {
            const binding = options?.prefix === 'formatted' ? formattedBindingPrefix : uriBindingPrefix;

            return `${binding}${values}`;
        }

        return values;
    }

    /**
     * Get an attribute list from either a uri binding
     * or formatted binding cpe value. The cpeAttributes
     * need to be pristine of any binding prefix.
     *
     * @private
     * @param {string} fullCpe
     * @param {string} cpeAttributes
     * @returns {string[]}
     * @memberof CpeParser
     */
    private getAttributeList(fullCpe: string, cpeAttributes: string): string[] {
        let attributes = cpeAttributes.split(':');

        if (!this.hasUriBinding(fullCpe) || !fullCpe.includes(uriBindingExtendedAttributesDelimiterKey))
            return attributes;

        let extendedAttributes = attributes.filter(x => x.startsWith('~')).pop();

        if(extendedAttributes) {
            let asteriskFilled = extendedAttributes.split('~').map(x => x || '*');
            attributes.pop();
            attributes = attributes.concat(asteriskFilled);
        }

        return attributes;
    }

    /**
     * Check if the cpe value has a uri binding syntax. This is
     * done by checking if the value starts with `cpe:/`.
     *
     * @param {string} cpe
     * @returns {boolean}
     * @memberof CpeParser
     */
    public hasUriBinding(cpe: string): boolean {
        return Boolean(cpe) && typeof cpe === 'string' && cpe.startsWith(uriBindingPrefix);
    }

    /**
     * Check if the cpe value has a formatted binding syntax. This is
     * done by checking if the value starts with `cpe:2.3:`.
     *
     * @param {string} cpe
     * @returns {boolean}
     * @memberof CpeParser
     */
    public hasFormattedBinding(cpe: string): boolean {
        return Boolean(cpe) && typeof cpe === 'string' && cpe.startsWith(formattedBindingPrefix);
    }

    /**
     * Applies logic per section 5.3.2 of:
     * https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nistir7695.pdf
     *
     * TODO: What to do with quoted (i.e. \) characters?
     * @private
     * @param {string} rawAttributeValue
     * @returns {string}
     * @memberof CpeParser
     */
    private parseAttributeValue(rawAttributeValue: string): string {
        if (typeof rawAttributeValue !== 'string' || !rawAttributeValue) return '';
        return rawAttributeValue.trim().replace(/_/g, ' ');
    }

    private formatAttributeValue(attributeValue: string): string {
        return attributeValue.replace(/\s/g, '_');
    }

    /**
     * Get the substring of the cpe that contain the values
     * that can be parsed into the hydrated model.
     *
     * @private
     * @param {string} fullCpe
     * @returns {string}
     * @memberof CpeParser
     */
    private getCpeAttributesSubstring(fullCpe: string): string {
        if (this.hasFormattedBinding(fullCpe))
            return fullCpe.substring(formattedBindingPrefix.length);

        if (this.hasUriBinding(fullCpe))
            return fullCpe.substring(uriBindingPrefix.length);

        return fullCpe;
    }
}
