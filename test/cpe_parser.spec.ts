import { Cpe } from '../src/cpe';
import { CpeParser } from '../src/parser';

const cpeParser = new CpeParser();

describe('CPE parser', () => {
  it(`will correctly determine a formatted binding syntax`, () => {
    let actual = cpeParser.hasFormattedBinding(
      `cpe:2.3:a:subscribe2_project:subscribe2:10.17.2:*:*:*:*:wordpress:*:*`
    );
    expect(actual).toEqual(true);
    actual = cpeParser.hasFormattedBinding(
      `cpe:/a:subscribe2_project:subscribe2:10.17.2:*:*:*:*:wordpress:*:*`
    );
    expect(actual).toEqual(false);
  });

  it(`will correctly determine a uri binding syntax`, () => {
    let actual = cpeParser.hasUriBinding(
      `cpe:2.3:a:subscribe2_project:subscribe2:10.17.2:*:*:*:*:wordpress:*:*`
    );
    expect(actual).toEqual(false);
    actual = cpeParser.hasUriBinding(
      `cpe:/a:subscribe2_project:subscribe2:10.17.2:*:*:*:*:wordpress:*:*`
    );
    expect(actual).toEqual(true);
  });

  /**
   * Formatted binding
   */
  describe('formatted binding', () => {
    it(`can parse valid 2.3 cpe string w/ formatted binding w/ an 'a' type`, () => {
      const actual = cpeParser.parse(
        `cpe:2.3:a:subscribe2_project:subscribe2:10.17.2:*:*:*:*:wordpress:*:*`
      );
      const expected = new Cpe();
      expected.part = 'a';
      expected.vendor = 'subscribe2 project';
      expected.product = 'subscribe2';
      expected.version = '10.17.2';
      expected.update = '*';
      expected.edition = '*';
      expected.language = '*';
      expected.sw_edition = '*';
      expected.target_sw = 'wordpress';
      expected.target_hw = '*';
      expected.other = '*';
      expect(actual).toEqual(expected);
    });

    it(`can parse valid 2.3 cpe string w/ formatted binding w/ an 'o' type`, () => {
      const actual = cpeParser.parse(
        `cpe:2.3:o:juniper:netscreen_screenos:3.0.3r3:*:*:*:*:*:*:*`
      );
      const expected = new Cpe();
      expected.part = 'o';
      expected.vendor = 'juniper';
      expected.product = 'netscreen screenos';
      expected.version = '3.0.3r3';
      expected.update = '*';
      expected.edition = '*';
      expected.language = '*';
      expected.sw_edition = '*';
      expected.target_sw = '*';
      expected.target_hw = '*';
      expected.other = '*';
      expect(actual).toEqual(expected);
    });

    it(`can parse valid 2.3 cpe string w/ formatted binding w/ an 'h' type`, () => {
      const actual = cpeParser.parse(
        `cpe:2.3:h:f5:big-ip_protocol_security_manager:10.2.3:*:*:*:*:*:*:*`
      );
      const expected = new Cpe();
      expected.part = 'h';
      expected.vendor = 'f5';
      expected.product = 'big-ip protocol security manager';
      expected.version = '10.2.3';
      expected.update = '*';
      expected.edition = '*';
      expected.language = '*';
      expected.sw_edition = '*';
      expected.target_sw = '*';
      expected.target_hw = '*';
      expected.other = '*';
      expect(actual).toEqual(expected);
    });
  });

  describe('uri binding', () => {
    /**
     * Uri binding
     */
    it(`can parse valid 2.3 cpe string w/ uri binding w/ an 'a' type w/ tildes`, () => {
      const actual = cpeParser.parse(
        `cpe:/a:search_autocomplete_project:search_autocomplete:7.x-3.0:rc3:~~~drupal~~`
      );
      const expected = new Cpe();
      expected.part = 'a';
      expected.vendor = 'search autocomplete project';
      expected.product = 'search autocomplete';
      expected.version = '7.x-3.0';
      expected.update = 'rc3';
      expected.edition = '*';
      expected.language = '*';
      expected.sw_edition = '*';
      expected.target_sw = 'drupal';
      expected.target_hw = '*';
      expected.other = '*';
      expect(actual).toEqual(expected);
    });

    it(`can parse valid 2.3 cpe string w/ uri binding w/ an 'o' type w/ no tildes`, () => {
      const actual = cpeParser.parse(
        `cpe:/o:huawei:ecns210_td_firmware:v100r004c10spc410`
      );
      const expected = new Cpe();
      expected.part = 'o';
      expected.vendor = 'huawei';
      expected.product = 'ecns210 td firmware';
      expected.version = 'v100r004c10spc410';
      expected.update = '*';
      expected.edition = '*';
      expected.language = '*';
      expected.sw_edition = '*';
      expected.target_sw = '*';
      expected.target_hw = '*';
      expected.other = '*';
      expect(actual).toEqual(expected);
    });

    it(`can parse valid 2.3 cpe string w/ uri binding w/ an 'h' type w/ no tildes`, () => {
      const actual = cpeParser.parse(`cpe:/h:netgear:rp114:-`);
      const expected = new Cpe();
      expected.part = 'h';
      expected.vendor = 'netgear';
      expected.product = 'rp114';
      expected.version = '-';
      expected.update = '*';
      expected.edition = '*';
      expected.language = '*';
      expected.sw_edition = '*';
      expected.target_sw = '*';
      expected.target_hw = '*';
      expected.other = '*';
      expect(actual).toEqual(expected);
    });
  });
});

describe('CPE stringifier', () => {
  it(`can stringify to a valid 2.3 cpe string w/ formatted binding`, () => {
    const expected = `cpe:2.3:a:subscribe2_project:subscribe2:10.17.2:*:*:*:*:wordpress:*:*`;
    const cpe = new Cpe();
    cpe.part = 'a';
    cpe.vendor = 'subscribe2 project';
    cpe.product = 'subscribe2';
    cpe.version = '10.17.2';
    cpe.update = '*';
    cpe.edition = '*';
    cpe.language = '*';
    cpe.sw_edition = '*';
    cpe.target_sw = 'wordpress';
    cpe.target_hw = '*';
    cpe.other = '*';
    const actual = cpeParser.stringify(cpe, { prefix: 'formatted' });

    expect(actual).toEqual(expected);
  });

  it(`can stringify to a valid 2.3 cpe string w/ uri binding`, () => {
    const expected = `cpe:/o:huawei:ecns210_td_firmware:v100r004c10spc410:*:*:*:*:*:*:*`;
    const cpe = new Cpe();
    cpe.part = 'o';
    cpe.vendor = 'huawei';
    cpe.product = 'ecns210 td firmware';
    cpe.version = 'v100r004c10spc410';
    cpe.update = '*';
    cpe.edition = '*';
    cpe.language = '*';
    cpe.sw_edition = '*';
    cpe.target_sw = '*';
    cpe.target_hw = '*';
    cpe.other = '*';
    const actual = cpeParser.stringify(cpe, { prefix: 'uri' });

    expect(actual).toEqual(expected);
  });
});
