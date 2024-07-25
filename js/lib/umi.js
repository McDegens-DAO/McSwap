(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  (function (global){(function (){
  const UMI=require("@metaplex-foundation/umi")
  global.window.UMI = UMI
  
  }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"@metaplex-foundation/umi":96}],2:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /**
   * Defines a type `T` that can also be `null`.
   * @category Utils â€” Options
   */
  
  /**
   * An implementation of the Rust Option type in JavaScript.
   * It can be one of the following:
   * - <code>{@link Some}<T></code>: Meaning there is a value of type T.
   * - <code>{@link None}</code>: Meaning there is no value.
   *
   * @category Utils â€” Options
   */
  
  /**
   * Defines a looser type that can be used when serializing an {@link Option}.
   * This allows us to pass null or the Option value directly whilst still
   * supporting the Option type for use-cases that need more type safety.
   *
   * @category Utils â€” Options
   */
  
  /**
   * Represents an option of type `T` that has a value.
   *
   * @see {@link Option}
   * @category Utils â€” Options
   */
  
  /**
   * Represents an option of type `T` that has no value.
   *
   * @see {@link Option}
   * @category Utils â€” Options
   */
  
  /**
   * Creates a new {@link Option} of type `T` that has a value.
   *
   * @see {@link Option}
   * @category Utils â€” Options
   */
  const some = value => ({
    __option: 'Some',
    value
  });
  
  /**
   * Creates a new {@link Option} of type `T` that has no value.
   *
   * @see {@link Option}
   * @category Utils â€” Options
   */
  const none = () => ({
    __option: 'None'
  });
  
  /**
   * Whether the given data is an {@link Option}.
   * @category Utils â€” Options
   */
  const isOption = input => input && typeof input === 'object' && '__option' in input && (input.__option === 'Some' && 'value' in input || input.__option === 'None');
  
  /**
   * Whether the given {@link Option} is a {@link Some}.
   * @category Utils â€” Options
   */
  const isSome = option => option.__option === 'Some';
  
  /**
   * Whether the given {@link Option} is a {@link None}.
   * @category Utils â€” Options
   */
  const isNone = option => option.__option === 'None';
  
  exports.isNone = isNone;
  exports.isOption = isOption;
  exports.isSome = isSome;
  exports.none = none;
  exports.some = some;
  
  
  },{}],3:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var common = require('./common.cjs');
  var unwrapOption = require('./unwrapOption.cjs');
  var unwrapOptionRecursively = require('./unwrapOptionRecursively.cjs');
  
  
  
  exports.isNone = common.isNone;
  exports.isOption = common.isOption;
  exports.isSome = common.isSome;
  exports.none = common.none;
  exports.some = common.some;
  exports.unwrapOption = unwrapOption.unwrapOption;
  exports.unwrapSome = unwrapOption.unwrapSome;
  exports.unwrapSomeOrElse = unwrapOption.unwrapSomeOrElse;
  exports.wrapNullable = unwrapOption.wrapNullable;
  exports.unwrapOptionRecursively = unwrapOptionRecursively.unwrapOptionRecursively;
  
  
  },{"./common.cjs":2,"./unwrapOption.cjs":4,"./unwrapOptionRecursively.cjs":5}],4:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var common = require('./common.cjs');
  
  /**
   * Unwraps the value of an {@link Option} of type `T`
   * or returns a fallback value that defaults to `null`.
   *
   * @category Utils â€” Options
   */
  
  function unwrapOption(option, fallback) {
    if (common.isSome(option)) return option.value;
    return fallback ? fallback() : null;
  }
  
  /**
   * Wraps a nullable value into an {@link Option}.
   *
   * @category Utils â€” Options
   */
  const wrapNullable = nullable => nullable !== null ? common.some(nullable) : common.none();
  
  /**
   * Unwraps the value of an {@link Option} of type `T`.
   * If the option is a {@link Some}, it returns its value,
   * Otherwise, it returns `null`.
   *
   * @category Utils â€” Options
   * @deprecated Use {@link unwrapOption} instead.
   */
  const unwrapSome = option => common.isSome(option) ? option.value : null;
  
  /**
   * Unwraps the value of an {@link Option} of type `T`
   * or returns a custom fallback value.
   * If the option is a {@link Some}, it returns its value,
   * Otherwise, it returns the return value of the provided fallback callback.
   *
   * @category Utils â€” Options
   * @deprecated Use {@link unwrapOption} instead.
   */
  const unwrapSomeOrElse = (option, fallback) => common.isSome(option) ? option.value : fallback();
  
  exports.unwrapOption = unwrapOption;
  exports.unwrapSome = unwrapSome;
  exports.unwrapSomeOrElse = unwrapSomeOrElse;
  exports.wrapNullable = wrapNullable;
  
  
  },{"./common.cjs":2}],5:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var common = require('./common.cjs');
  
  /**
   * A type that defines the recursive unwrapping of a type `T`
   * such that all nested {@link Option} types are unwrapped.
   *
   * For each nested {@link Option} type, if the option is a {@link Some},
   * it returns the type of its value, otherwise, it returns the provided
   * fallback type `U` which defaults to `null`.
   *
   * @category Utils â€” Options
   */
  
  function unwrapOptionRecursively(input, fallback) {
    // Types to bypass.
    if (!input || ArrayBuffer.isView(input)) {
      return input;
    }
    const next = x => fallback ? unwrapOptionRecursively(x, fallback) : unwrapOptionRecursively(x);
  
    // Handle Option.
    if (common.isOption(input)) {
      if (common.isSome(input)) return next(input.value);
      return fallback ? fallback() : null;
    }
  
    // Walk.
    if (Array.isArray(input)) {
      return input.map(next);
    }
    if (typeof input === 'object') {
      return Object.fromEntries(Object.entries(input).map(([k, v]) => [k, next(v)]));
    }
    return input;
  }
  
  exports.unwrapOptionRecursively = unwrapOptionRecursively;
  
  
  },{"./common.cjs":2}],6:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersEncodings = require('@metaplex-foundation/umi-serializers-encodings');
  var errors = require('./errors.cjs');
  
  /**
   * The amount of bytes in a public key.
   * @category Signers and PublicKeys
   */
  const PUBLIC_KEY_LENGTH = 32;
  
  /**
   * Defines a public key as a base58 string.
   * @category Signers and PublicKeys
   */
  
  function publicKey(input, assertValidPublicKey = true) {
    const key = (() => {
      if (typeof input === 'string') {
        return input;
      }
      // HasPublicKey.
      if (typeof input === 'object' && 'publicKey' in input) {
        return input.publicKey;
      }
      // LegacyWeb3JsPublicKey.
      if (typeof input === 'object' && 'toBase58' in input) {
        return input.toBase58();
      }
      // Pda.
      if (Array.isArray(input)) {
        return input[0];
      }
      // PublicKeyBytes.
      return umiSerializersEncodings.base58.deserialize(input)[0];
    })();
    if (assertValidPublicKey) {
      assertPublicKey(key);
    }
    return key;
  }
  
  /**
   * Creates the default public key which is composed of all zero bytes.
   * @category Signers and PublicKeys
   */
  const defaultPublicKey = () => '11111111111111111111111111111111';
  
  /**
   * Whether the given value is a valid public key.
   * @category Signers and PublicKeys
   */
  const isPublicKey = value => {
    try {
      assertPublicKey(value);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * Whether the given value is a valid program-derived address.
   * @category Signers and PublicKeys
   */
  const isPda = value => Array.isArray(value) && value.length === 2 && typeof value[1] === 'number' && isPublicKey(value[0]);
  
  /**
   * Ensures the given value is a valid public key.
   * @category Signers and PublicKeys
   */
  function assertPublicKey(value) {
    // Check value type.
    if (typeof value !== 'string') {
      throw new errors.InvalidPublicKeyError(value, 'Public keys must be strings.');
    }
  
    // Check base58 encoding and byte length.
    publicKeyBytes(value);
  }
  
  /**
   * Deduplicates the given array of public keys.
   * @category Signers and PublicKeys
   */
  const uniquePublicKeys = publicKeys => [...new Set(publicKeys)];
  
  /**
   * Converts the given public key to a Uint8Array.
   * Throws an error if the public key is an invalid base58 string.
   * @category Signers and PublicKeys
   */
  const publicKeyBytes = value => {
    // Check string length to avoid unnecessary base58 encoding.
    if (value.length < 32 || value.length > 44) {
      throw new errors.InvalidPublicKeyError(value, 'Public keys must be between 32 and 44 characters.');
    }
  
    // Check base58 encoding.
    let bytes;
    try {
      bytes = umiSerializersEncodings.base58.serialize(value);
    } catch (error) {
      throw new errors.InvalidPublicKeyError(value, 'Public keys must be base58 encoded.');
    }
  
    // Check byte length.
    if (bytes.length !== PUBLIC_KEY_LENGTH) {
      throw new errors.InvalidPublicKeyError(value, `Public keys must be ${PUBLIC_KEY_LENGTH} bytes.`);
    }
    return bytes;
  };
  
  /**
   * Converts the given public key to a base58 string.
   * @category Signers and PublicKeys
   * @deprecated Public keys are now represented directly as base58 strings.
   */
  const base58PublicKey = key => publicKey(key);
  
  /**
   * Whether the given public keys are the same.
   * @category Signers and PublicKeys
   * @deprecated Use `left === right` instead now that public keys are base58 strings.
   */
  const samePublicKey = (left, right) => publicKey(left) === publicKey(right);
  
  exports.PUBLIC_KEY_LENGTH = PUBLIC_KEY_LENGTH;
  exports.assertPublicKey = assertPublicKey;
  exports.base58PublicKey = base58PublicKey;
  exports.defaultPublicKey = defaultPublicKey;
  exports.isPda = isPda;
  exports.isPublicKey = isPublicKey;
  exports.publicKey = publicKey;
  exports.publicKeyBytes = publicKeyBytes;
  exports.samePublicKey = samePublicKey;
  exports.uniquePublicKeys = uniquePublicKeys;
  
  
  },{"./errors.cjs":7,"@metaplex-foundation/umi-serializers-encodings":22}],7:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /** @category Errors */
  class InvalidPublicKeyError extends Error {
    name = 'InvalidPublicKeyError';
    constructor(invalidPublicKey, reason) {
      reason = reason ? `. ${reason}` : '';
      super(`The provided public key is invalid: ${invalidPublicKey}${reason}`);
      this.invalidPublicKey = invalidPublicKey;
    }
  }
  
  exports.InvalidPublicKeyError = InvalidPublicKeyError;
  
  
  },{}],8:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var common = require('./common.cjs');
  var errors = require('./errors.cjs');
  
  
  
  exports.PUBLIC_KEY_LENGTH = common.PUBLIC_KEY_LENGTH;
  exports.assertPublicKey = common.assertPublicKey;
  exports.base58PublicKey = common.base58PublicKey;
  exports.defaultPublicKey = common.defaultPublicKey;
  exports.isPda = common.isPda;
  exports.isPublicKey = common.isPublicKey;
  exports.publicKey = common.publicKey;
  exports.publicKeyBytes = common.publicKeyBytes;
  exports.samePublicKey = common.samePublicKey;
  exports.uniquePublicKeys = common.uniquePublicKeys;
  exports.InvalidPublicKeyError = errors.InvalidPublicKeyError;
  
  
  },{"./common.cjs":6,"./errors.cjs":7}],9:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /**
   * Concatenates an array of `Uint8Array`s into a single `Uint8Array`.
   * @category Utils
   */
  const mergeBytes = bytesArr => {
    const totalLength = bytesArr.reduce((total, arr) => total + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    bytesArr.forEach(arr => {
      result.set(arr, offset);
      offset += arr.length;
    });
    return result;
  };
  
  /**
   * Pads a `Uint8Array` with zeroes to the specified length.
   * If the array is longer than the specified length, it is returned as-is.
   * @category Utils
   */
  const padBytes = (bytes, length) => {
    if (bytes.length >= length) return bytes;
    const paddedBytes = new Uint8Array(length).fill(0);
    paddedBytes.set(bytes);
    return paddedBytes;
  };
  
  /**
   * Fixes a `Uint8Array` to the specified length.
   * If the array is longer than the specified length, it is truncated.
   * If the array is shorter than the specified length, it is padded with zeroes.
   * @category Utils
   */
  const fixBytes = (bytes, length) => padBytes(bytes.slice(0, length), length);
  
  exports.fixBytes = fixBytes;
  exports.mergeBytes = mergeBytes;
  exports.padBytes = padBytes;
  
  
  },{}],10:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /** @category Errors */
  class DeserializingEmptyBufferError extends Error {
    name = 'DeserializingEmptyBufferError';
    constructor(serializer) {
      super(`Serializer [${serializer}] cannot deserialize empty buffers.`);
    }
  }
  
  /** @category Errors */
  class NotEnoughBytesError extends Error {
    name = 'NotEnoughBytesError';
    constructor(serializer, expected, actual) {
      super(`Serializer [${serializer}] expected ${expected} bytes, got ${actual}.`);
    }
  }
  
  /** @category Errors */
  class ExpectedFixedSizeSerializerError extends Error {
    name = 'ExpectedFixedSizeSerializerError';
    constructor(message) {
      message ??= 'Expected a fixed-size serializer, got a variable-size one.';
      super(message);
    }
  }
  
  exports.DeserializingEmptyBufferError = DeserializingEmptyBufferError;
  exports.ExpectedFixedSizeSerializerError = ExpectedFixedSizeSerializerError;
  exports.NotEnoughBytesError = NotEnoughBytesError;
  
  
  },{}],11:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var bytes = require('./bytes.cjs');
  var errors = require('./errors.cjs');
  
  /**
   * Creates a fixed-size serializer from a given serializer.
   *
   * @param serializer - The serializer to wrap into a fixed-size serializer.
   * @param fixedBytes - The fixed number of bytes to read.
   * @param description - A custom description for the serializer.
   *
   * @category Serializers
   */
  function fixSerializer(serializer, fixedBytes, description) {
    return {
      description: description ?? `fixed(${fixedBytes}, ${serializer.description})`,
      fixedSize: fixedBytes,
      maxSize: fixedBytes,
      serialize: value => bytes.fixBytes(serializer.serialize(value), fixedBytes),
      deserialize: (buffer, offset = 0) => {
        // Slice the buffer to the fixed size.
        buffer = buffer.slice(offset, offset + fixedBytes);
        // Ensure we have enough bytes.
        if (buffer.length < fixedBytes) {
          throw new errors.NotEnoughBytesError('fixSerializer', fixedBytes, buffer.length);
        }
        // If the nested serializer is fixed-size, pad and truncate the buffer accordingly.
        if (serializer.fixedSize !== null) {
          buffer = bytes.fixBytes(buffer, serializer.fixedSize);
        }
        // Deserialize the value using the nested serializer.
        const [value] = serializer.deserialize(buffer, 0);
        return [value, offset + fixedBytes];
      }
    };
  }
  
  exports.fixSerializer = fixSerializer;
  
  
  },{"./bytes.cjs":9,"./errors.cjs":10}],12:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var bytes = require('./bytes.cjs');
  var errors = require('./errors.cjs');
  var fixSerializer = require('./fixSerializer.cjs');
  var mapSerializer = require('./mapSerializer.cjs');
  var reverseSerializer = require('./reverseSerializer.cjs');
  
  
  
  exports.fixBytes = bytes.fixBytes;
  exports.mergeBytes = bytes.mergeBytes;
  exports.padBytes = bytes.padBytes;
  exports.DeserializingEmptyBufferError = errors.DeserializingEmptyBufferError;
  exports.ExpectedFixedSizeSerializerError = errors.ExpectedFixedSizeSerializerError;
  exports.NotEnoughBytesError = errors.NotEnoughBytesError;
  exports.fixSerializer = fixSerializer.fixSerializer;
  exports.mapSerializer = mapSerializer.mapSerializer;
  exports.reverseSerializer = reverseSerializer.reverseSerializer;
  
  
  },{"./bytes.cjs":9,"./errors.cjs":10,"./fixSerializer.cjs":11,"./mapSerializer.cjs":13,"./reverseSerializer.cjs":14}],13:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /**
   * Converts a serializer A to a serializer B by mapping their values.
   * @category Serializers
   */
  
  function mapSerializer(serializer, unmap, map) {
    return {
      description: serializer.description,
      fixedSize: serializer.fixedSize,
      maxSize: serializer.maxSize,
      serialize: value => serializer.serialize(unmap(value)),
      deserialize: (buffer, offset = 0) => {
        const [value, length] = serializer.deserialize(buffer, offset);
        return map ? [map(value, buffer, offset), length] : [value, length];
      }
    };
  }
  
  exports.mapSerializer = mapSerializer;
  
  
  },{}],14:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var bytes = require('./bytes.cjs');
  var errors = require('./errors.cjs');
  
  /**
   * Reverses the bytes of a fixed-size serializer.
   * @category Serializers
   */
  function reverseSerializer(serializer) {
    if (serializer.fixedSize === null) {
      throw new errors.ExpectedFixedSizeSerializerError('Cannot reverse a serializer of variable size.');
    }
    return {
      ...serializer,
      serialize: value => serializer.serialize(value).reverse(),
      deserialize: (bytes$1, offset = 0) => {
        const fixedSize = serializer.fixedSize;
        const newBytes = bytes.mergeBytes([bytes$1.slice(0, offset), bytes$1.slice(offset, offset + fixedSize).reverse(), bytes$1.slice(offset + fixedSize)]);
        return serializer.deserialize(newBytes, offset);
      }
    };
  }
  
  exports.reverseSerializer = reverseSerializer;
  
  
  },{"./bytes.cjs":9,"./errors.cjs":10}],15:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var baseX = require('./baseX.cjs');
  
  /**
   * A string serializer that uses base10 encoding.
   * @category Serializers
   */
  const base10 = baseX.baseX('0123456789');
  
  exports.base10 = base10;
  
  
  },{"./baseX.cjs":19}],16:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var errors = require('./errors.cjs');
  
  /**
   * A string serializer that uses base16 encoding.
   * @category Serializers
   */
  const base16 = {
    description: 'base16',
    fixedSize: null,
    maxSize: null,
    serialize(value) {
      const lowercaseValue = value.toLowerCase();
      if (!lowercaseValue.match(/^[0123456789abcdef]*$/)) {
        throw new errors.InvalidBaseStringError(value, 16);
      }
      const matches = lowercaseValue.match(/.{1,2}/g);
      return Uint8Array.from(matches ? matches.map(byte => parseInt(byte, 16)) : []);
    },
    deserialize(buffer, offset = 0) {
      const value = buffer.slice(offset).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
      return [value, buffer.length];
    }
  };
  
  exports.base16 = base16;
  
  
  },{"./errors.cjs":21}],17:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var baseX = require('./baseX.cjs');
  
  /**
   * A string serializer that uses base58 encoding.
   * @category Serializers
   */
  const base58 = baseX.baseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
  
  exports.base58 = base58;
  
  
  },{"./baseX.cjs":19}],18:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var baseXReslice = require('./baseXReslice.cjs');
  
  /**
   * A string serializer that uses base64 encoding.
   * @category Serializers
   */
  const base64 = umiSerializersCore.mapSerializer(baseXReslice.baseXReslice('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', 6), value => value.replace(/=/g, ''), value => value.padEnd(Math.ceil(value.length / 4) * 4, '='));
  
  exports.base64 = base64;
  
  
  },{"./baseXReslice.cjs":20,"@metaplex-foundation/umi-serializers-core":12}],19:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var errors = require('./errors.cjs');
  
  /**
   * A string serializer that requires a custom alphabet and uses
   * the length of that alphabet as the base. It then divides
   * the input by the base as many times as necessary to get
   * the output. It also supports leading zeroes by using the
   * first character of the alphabet as the zero character.
   *
   * This can be used to create serializers such as base10 or base58.
   *
   * @category Serializers
   */
  const baseX = alphabet => {
    const base = alphabet.length;
    const baseBigInt = BigInt(base);
    return {
      description: `base${base}`,
      fixedSize: null,
      maxSize: null,
      serialize(value) {
        // Check if the value is valid.
        if (!value.match(new RegExp(`^[${alphabet}]*$`))) {
          throw new errors.InvalidBaseStringError(value, base);
        }
        if (value === '') return new Uint8Array();
  
        // Handle leading zeroes.
        const chars = [...value];
        let trailIndex = chars.findIndex(c => c !== alphabet[0]);
        trailIndex = trailIndex === -1 ? chars.length : trailIndex;
        const leadingZeroes = Array(trailIndex).fill(0);
        if (trailIndex === chars.length) return Uint8Array.from(leadingZeroes);
  
        // From baseX to base10.
        const tailChars = chars.slice(trailIndex);
        let base10Number = 0n;
        let baseXPower = 1n;
        for (let i = tailChars.length - 1; i >= 0; i -= 1) {
          base10Number += baseXPower * BigInt(alphabet.indexOf(tailChars[i]));
          baseXPower *= baseBigInt;
        }
  
        // From base10 to bytes.
        const tailBytes = [];
        while (base10Number > 0n) {
          tailBytes.unshift(Number(base10Number % 256n));
          base10Number /= 256n;
        }
        return Uint8Array.from(leadingZeroes.concat(tailBytes));
      },
      deserialize(buffer, offset = 0) {
        if (buffer.length === 0) return ['', 0];
  
        // Handle leading zeroes.
        const bytes = buffer.slice(offset);
        let trailIndex = bytes.findIndex(n => n !== 0);
        trailIndex = trailIndex === -1 ? bytes.length : trailIndex;
        const leadingZeroes = alphabet[0].repeat(trailIndex);
        if (trailIndex === bytes.length) return [leadingZeroes, buffer.length];
  
        // From bytes to base10.
        let base10Number = bytes.slice(trailIndex).reduce((sum, byte) => sum * 256n + BigInt(byte), 0n);
  
        // From base10 to baseX.
        const tailChars = [];
        while (base10Number > 0n) {
          tailChars.unshift(alphabet[Number(base10Number % baseBigInt)]);
          base10Number /= baseBigInt;
        }
        return [leadingZeroes + tailChars.join(''), buffer.length];
      }
    };
  };
  
  exports.baseX = baseX;
  
  
  },{"./errors.cjs":21}],20:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var errors = require('./errors.cjs');
  
  /* eslint-disable no-restricted-syntax */
  
  /**
   * A string serializer that reslices bytes into custom chunks
   * of bits that are then mapped to a custom alphabet.
   *
   * This can be used to create serializers whose alphabet
   * is a power of 2 such as base16 or base64.
   *
   * @category Serializers
   */
  const baseXReslice = (alphabet, bits) => {
    const base = alphabet.length;
    const reslice = (input, inputBits, outputBits, useRemainder) => {
      const output = [];
      let accumulator = 0;
      let bitsInAccumulator = 0;
      const mask = (1 << outputBits) - 1;
      for (const value of input) {
        accumulator = accumulator << inputBits | value;
        bitsInAccumulator += inputBits;
        while (bitsInAccumulator >= outputBits) {
          bitsInAccumulator -= outputBits;
          output.push(accumulator >> bitsInAccumulator & mask);
        }
      }
      if (useRemainder && bitsInAccumulator > 0) {
        output.push(accumulator << outputBits - bitsInAccumulator & mask);
      }
      return output;
    };
    return {
      description: `base${base}`,
      fixedSize: null,
      maxSize: null,
      serialize(value) {
        // Check if the value is valid.
        if (!value.match(new RegExp(`^[${alphabet}]*$`))) {
          throw new errors.InvalidBaseStringError(value, base);
        }
        if (value === '') return new Uint8Array();
        const charIndices = [...value].map(c => alphabet.indexOf(c));
        const bytes = reslice(charIndices, bits, 8, false);
        return Uint8Array.from(bytes);
      },
      deserialize(buffer, offset = 0) {
        if (buffer.length === 0) return ['', 0];
        const bytes = [...buffer.slice(offset)];
        const charIndices = reslice(bytes, 8, bits, true);
        return [charIndices.map(i => alphabet[i]).join(''), buffer.length];
      }
    };
  };
  
  exports.baseXReslice = baseXReslice;
  
  
  },{"./errors.cjs":21}],21:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /** @category Errors */
  class InvalidBaseStringError extends Error {
    name = 'InvalidBaseStringError';
    constructor(value, base, cause) {
      const message = `Expected a string of base ${base}, got [${value}].`;
      super(message);
      this.cause = cause;
    }
  }
  
  exports.InvalidBaseStringError = InvalidBaseStringError;
  
  
  },{}],22:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var base10 = require('./base10.cjs');
  var base16 = require('./base16.cjs');
  var base58 = require('./base58.cjs');
  var base64 = require('./base64.cjs');
  var baseX = require('./baseX.cjs');
  var baseXReslice = require('./baseXReslice.cjs');
  var errors = require('./errors.cjs');
  var nullCharacters = require('./nullCharacters.cjs');
  var utf8 = require('./utf8.cjs');
  
  
  
  exports.base10 = base10.base10;
  exports.base16 = base16.base16;
  exports.base58 = base58.base58;
  exports.base64 = base64.base64;
  exports.baseX = baseX.baseX;
  exports.baseXReslice = baseXReslice.baseXReslice;
  exports.InvalidBaseStringError = errors.InvalidBaseStringError;
  exports.padNullCharacters = nullCharacters.padNullCharacters;
  exports.removeNullCharacters = nullCharacters.removeNullCharacters;
  exports.utf8 = utf8.utf8;
  
  
  },{"./base10.cjs":15,"./base16.cjs":16,"./base58.cjs":17,"./base64.cjs":18,"./baseX.cjs":19,"./baseXReslice.cjs":20,"./errors.cjs":21,"./nullCharacters.cjs":23,"./utf8.cjs":24}],23:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /**
   * Removes null characters from a string.
   * @category Utils
   */
  const removeNullCharacters = value =>
  // eslint-disable-next-line no-control-regex
  value.replace(/\u0000/g, '');
  
  /**
   * Pads a string with null characters at the end.
   * @category Utils
   */
  const padNullCharacters = (value, chars) => value.padEnd(chars, '\u0000');
  
  exports.padNullCharacters = padNullCharacters;
  exports.removeNullCharacters = removeNullCharacters;
  
  
  },{}],24:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var nullCharacters = require('./nullCharacters.cjs');
  
  /**
   * A string serializer that uses UTF-8 encoding
   * using the native `TextEncoder` API.
   * @category Serializers
   */
  const utf8 = {
    description: 'utf8',
    fixedSize: null,
    maxSize: null,
    serialize(value) {
      return new TextEncoder().encode(value);
    },
    deserialize(buffer, offset = 0) {
      const value = new TextDecoder().decode(buffer.slice(offset));
      return [nullCharacters.removeNullCharacters(value), buffer.length];
    }
  };
  
  exports.utf8 = utf8;
  
  
  },{"./nullCharacters.cjs":23}],25:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /**
   * Defines a serializer for numbers and bigints.
   * @category Serializers
   */
  
  /**
   * Defines the options for u8 and i8 serializers.
   * @category Serializers
   */
  
  /**
   * Defines the options for number serializers that use more than one byte.
   * @category Serializers
   */
  
  /**
   * Defines the endianness of a number serializer.
   * @category Serializers
   */
  exports.Endian = void 0;
  (function (Endian) {
    Endian["Little"] = "le";
    Endian["Big"] = "be";
  })(exports.Endian || (exports.Endian = {}));
  
  
  },{}],26:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /** @category Errors */
  class NumberOutOfRangeError extends RangeError {
    name = 'NumberOutOfRangeError';
    constructor(serializer, min, max, actual) {
      super(`Serializer [${serializer}] expected number to be between ${min} and ${max}, got ${actual}.`);
    }
  }
  
  exports.NumberOutOfRangeError = NumberOutOfRangeError;
  
  
  },{}],27:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  const f32 = (options = {}) => utils.numberFactory({
    name: 'f32',
    size: 4,
    set: (view, value, le) => view.setFloat32(0, Number(value), le),
    get: (view, le) => view.getFloat32(0, le),
    options
  });
  
  exports.f32 = f32;
  
  
  },{"./utils.cjs":41}],28:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  const f64 = (options = {}) => utils.numberFactory({
    name: 'f64',
    size: 8,
    set: (view, value, le) => view.setFloat64(0, Number(value), le),
    get: (view, le) => view.getFloat64(0, le),
    options
  });
  
  exports.f64 = f64;
  
  
  },{"./utils.cjs":41}],29:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  /* eslint-disable no-bitwise */
  const i128 = (options = {}) => utils.numberFactory({
    name: 'i128',
    size: 16,
    range: [-BigInt('0x7fffffffffffffffffffffffffffffff') - 1n, BigInt('0x7fffffffffffffffffffffffffffffff')],
    set: (view, value, le) => {
      const leftOffset = le ? 8 : 0;
      const rightOffset = le ? 0 : 8;
      const rightMask = 0xffffffffffffffffn;
      view.setBigInt64(leftOffset, BigInt(value) >> 64n, le);
      view.setBigUint64(rightOffset, BigInt(value) & rightMask, le);
    },
    get: (view, le) => {
      const leftOffset = le ? 8 : 0;
      const rightOffset = le ? 0 : 8;
      const left = view.getBigInt64(leftOffset, le);
      const right = view.getBigUint64(rightOffset, le);
      return (left << 64n) + right;
    },
    options
  });
  
  exports.i128 = i128;
  
  
  },{"./utils.cjs":41}],30:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  const i16 = (options = {}) => utils.numberFactory({
    name: 'i16',
    size: 2,
    range: [-Number('0x7fff') - 1, Number('0x7fff')],
    set: (view, value, le) => view.setInt16(0, Number(value), le),
    get: (view, le) => view.getInt16(0, le),
    options
  });
  
  exports.i16 = i16;
  
  
  },{"./utils.cjs":41}],31:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  const i32 = (options = {}) => utils.numberFactory({
    name: 'i32',
    size: 4,
    range: [-Number('0x7fffffff') - 1, Number('0x7fffffff')],
    set: (view, value, le) => view.setInt32(0, Number(value), le),
    get: (view, le) => view.getInt32(0, le),
    options
  });
  
  exports.i32 = i32;
  
  
  },{"./utils.cjs":41}],32:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  const i64 = (options = {}) => utils.numberFactory({
    name: 'i64',
    size: 8,
    range: [-BigInt('0x7fffffffffffffff') - 1n, BigInt('0x7fffffffffffffff')],
    set: (view, value, le) => view.setBigInt64(0, BigInt(value), le),
    get: (view, le) => view.getBigInt64(0, le),
    options
  });
  
  exports.i64 = i64;
  
  
  },{"./utils.cjs":41}],33:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  const i8 = (options = {}) => utils.numberFactory({
    name: 'i8',
    size: 1,
    range: [-Number('0x7f') - 1, Number('0x7f')],
    set: (view, value) => view.setInt8(0, Number(value)),
    get: view => view.getInt8(0),
    options
  });
  
  exports.i8 = i8;
  
  
  },{"./utils.cjs":41}],34:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var common = require('./common.cjs');
  var errors = require('./errors.cjs');
  var f32 = require('./f32.cjs');
  var f64 = require('./f64.cjs');
  var i8 = require('./i8.cjs');
  var i16 = require('./i16.cjs');
  var i32 = require('./i32.cjs');
  var i64 = require('./i64.cjs');
  var i128 = require('./i128.cjs');
  var u8 = require('./u8.cjs');
  var u16 = require('./u16.cjs');
  var u32 = require('./u32.cjs');
  var u64 = require('./u64.cjs');
  var u128 = require('./u128.cjs');
  var shortU16 = require('./shortU16.cjs');
  
  
  
  Object.defineProperty(exports, 'Endian', {
    enumerable: true,
    get: function () { return common.Endian; }
  });
  exports.NumberOutOfRangeError = errors.NumberOutOfRangeError;
  exports.f32 = f32.f32;
  exports.f64 = f64.f64;
  exports.i8 = i8.i8;
  exports.i16 = i16.i16;
  exports.i32 = i32.i32;
  exports.i64 = i64.i64;
  exports.i128 = i128.i128;
  exports.u8 = u8.u8;
  exports.u16 = u16.u16;
  exports.u32 = u32.u32;
  exports.u64 = u64.u64;
  exports.u128 = u128.u128;
  exports.shortU16 = shortU16.shortU16;
  
  
  },{"./common.cjs":25,"./errors.cjs":26,"./f32.cjs":27,"./f64.cjs":28,"./i128.cjs":29,"./i16.cjs":30,"./i32.cjs":31,"./i64.cjs":32,"./i8.cjs":33,"./shortU16.cjs":35,"./u128.cjs":36,"./u16.cjs":37,"./u32.cjs":38,"./u64.cjs":39,"./u8.cjs":40}],35:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  /* eslint-disable no-bitwise */
  
  /**
   * Defines the options for the shortU16 serializer.
   * @category Serializers
   */
  
  /**
   * Same as u16, but serialized with 1 to 3 bytes.
   *
   * If the value is above 0x7f, the top bit is set and the remaining
   * value is stored in the next bytes. Each byte follows the same
   * pattern until the 3rd byte. The 3rd byte, if needed, uses
   * all 8 bits to store the last byte of the original value.
   *
   * @category Serializers
   */
  const shortU16 = (options = {}) => ({
    description: options.description ?? 'shortU16',
    fixedSize: null,
    maxSize: 3,
    serialize: value => {
      utils.assertRange('shortU16', 0, 65535, value);
      const bytes = [0];
      for (let ii = 0;; ii += 1) {
        // Shift the bits of the value over such that the next 7 bits are at the right edge.
        const alignedValue = value >> ii * 7;
        if (alignedValue === 0) {
          // No more bits to consume.
          break;
        }
        // Extract those 7 bits using a mask.
        const nextSevenBits = 0b1111111 & alignedValue;
        bytes[ii] = nextSevenBits;
        if (ii > 0) {
          // Set the continuation bit of the previous slice.
          bytes[ii - 1] |= 0b10000000;
        }
      }
      return new Uint8Array(bytes);
    },
    deserialize: (bytes, offset = 0) => {
      let value = 0;
      let byteCount = 0;
      while (++byteCount // eslint-disable-line no-plusplus
      ) {
        const byteIndex = byteCount - 1;
        const currentByte = bytes[offset + byteIndex];
        const nextSevenBits = 0b1111111 & currentByte;
        // Insert the next group of seven bits into the correct slot of the output value.
        value |= nextSevenBits << byteIndex * 7;
        if ((currentByte & 0b10000000) === 0) {
          // This byte does not have its continuation bit set. We're done.
          break;
        }
      }
      return [value, offset + byteCount];
    }
  });
  
  exports.shortU16 = shortU16;
  
  
  },{"./utils.cjs":41}],36:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  /* eslint-disable no-bitwise */
  const u128 = (options = {}) => utils.numberFactory({
    name: 'u128',
    size: 16,
    range: [0, BigInt('0xffffffffffffffffffffffffffffffff')],
    set: (view, value, le) => {
      const leftOffset = le ? 8 : 0;
      const rightOffset = le ? 0 : 8;
      const rightMask = 0xffffffffffffffffn;
      view.setBigUint64(leftOffset, BigInt(value) >> 64n, le);
      view.setBigUint64(rightOffset, BigInt(value) & rightMask, le);
    },
    get: (view, le) => {
      const leftOffset = le ? 8 : 0;
      const rightOffset = le ? 0 : 8;
      const left = view.getBigUint64(leftOffset, le);
      const right = view.getBigUint64(rightOffset, le);
      return (left << 64n) + right;
    },
    options
  });
  
  exports.u128 = u128;
  
  
  },{"./utils.cjs":41}],37:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  const u16 = (options = {}) => utils.numberFactory({
    name: 'u16',
    size: 2,
    range: [0, Number('0xffff')],
    set: (view, value, le) => view.setUint16(0, Number(value), le),
    get: (view, le) => view.getUint16(0, le),
    options
  });
  
  exports.u16 = u16;
  
  
  },{"./utils.cjs":41}],38:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  const u32 = (options = {}) => utils.numberFactory({
    name: 'u32',
    size: 4,
    range: [0, Number('0xffffffff')],
    set: (view, value, le) => view.setUint32(0, Number(value), le),
    get: (view, le) => view.getUint32(0, le),
    options
  });
  
  exports.u32 = u32;
  
  
  },{"./utils.cjs":41}],39:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  const u64 = (options = {}) => utils.numberFactory({
    name: 'u64',
    size: 8,
    range: [0, BigInt('0xffffffffffffffff')],
    set: (view, value, le) => view.setBigUint64(0, BigInt(value), le),
    get: (view, le) => view.getBigUint64(0, le),
    options
  });
  
  exports.u64 = u64;
  
  
  },{"./utils.cjs":41}],40:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var utils = require('./utils.cjs');
  
  const u8 = (options = {}) => utils.numberFactory({
    name: 'u8',
    size: 1,
    range: [0, Number('0xff')],
    set: (view, value) => view.setUint8(0, Number(value)),
    get: view => view.getUint8(0),
    options
  });
  
  exports.u8 = u8;
  
  
  },{"./utils.cjs":41}],41:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var common = require('./common.cjs');
  var errors = require('./errors.cjs');
  
  function numberFactory(input) {
    let littleEndian;
    let defaultDescription = input.name;
    if (input.size > 1) {
      littleEndian = !('endian' in input.options) || input.options.endian === common.Endian.Little;
      defaultDescription += littleEndian ? '(le)' : '(be)';
    }
    return {
      description: input.options.description ?? defaultDescription,
      fixedSize: input.size,
      maxSize: input.size,
      serialize(value) {
        if (input.range) {
          assertRange(input.name, input.range[0], input.range[1], value);
        }
        const buffer = new ArrayBuffer(input.size);
        input.set(new DataView(buffer), value, littleEndian);
        return new Uint8Array(buffer);
      },
      deserialize(bytes, offset = 0) {
        const slice = bytes.slice(offset, offset + input.size);
        assertEnoughBytes('i8', slice, input.size);
        const view = toDataView(slice);
        return [input.get(view, littleEndian), offset + input.size];
      }
    };
  }
  
  /**
   * Helper function to ensure that the array buffer is converted properly from a uint8array
   * Source: https://stackoverflow.com/questions/37228285/uint8array-to-arraybuffer
   * @param {Uint8Array} array Uint8array that's being converted into an array buffer
   * @returns {ArrayBuffer} An array buffer that's necessary to construct a data view
   */
  const toArrayBuffer = array => array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset);
  const toDataView = array => new DataView(toArrayBuffer(array));
  const assertRange = (serializer, min, max, value) => {
    if (value < min || value > max) {
      throw new errors.NumberOutOfRangeError(serializer, min, max, value);
    }
  };
  const assertEnoughBytes = (serializer, bytes, expected) => {
    if (bytes.length === 0) {
      throw new umiSerializersCore.DeserializingEmptyBufferError(serializer);
    }
    if (bytes.length < expected) {
      throw new umiSerializersCore.NotEnoughBytesError(serializer, expected, bytes.length);
    }
  };
  
  exports.assertEnoughBytes = assertEnoughBytes;
  exports.assertRange = assertRange;
  exports.numberFactory = numberFactory;
  exports.toArrayBuffer = toArrayBuffer;
  exports.toDataView = toDataView;
  
  
  },{"./common.cjs":25,"./errors.cjs":26,"@metaplex-foundation/umi-serializers-core":12}],42:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var umiSerializersNumbers = require('@metaplex-foundation/umi-serializers-numbers');
  var errors = require('./errors.cjs');
  var utils = require('./utils.cjs');
  
  /**
   * Defines the options for array serializers.
   * @category Serializers
   */
  
  /**
   * Creates a serializer for an array of items.
   *
   * @param item - The serializer to use for the array's items.
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function array(item, options = {}) {
    const size = options.size ?? umiSerializersNumbers.u32();
    if (size === 'remainder' && item.fixedSize === null) {
      throw new umiSerializersCore.ExpectedFixedSizeSerializerError('Serializers of "remainder" size must have fixed-size items.');
    }
    return {
      description: options.description ?? `array(${item.description}; ${utils.getSizeDescription(size)})`,
      fixedSize: utils.getSizeFromChildren(size, [item.fixedSize]),
      maxSize: utils.getSizeFromChildren(size, [item.maxSize]),
      serialize: value => {
        if (typeof size === 'number' && value.length !== size) {
          throw new errors.InvalidNumberOfItemsError('array', size, value.length);
        }
        return umiSerializersCore.mergeBytes([utils.getSizePrefix(size, value.length), ...value.map(v => item.serialize(v))]);
      },
      deserialize: (bytes, offset = 0) => {
        if (typeof size === 'object' && bytes.slice(offset).length === 0) {
          return [[], offset];
        }
        const [resolvedSize, newOffset] = utils.getResolvedSize(size, [item.fixedSize], bytes, offset);
        offset = newOffset;
        const values = [];
        for (let i = 0; i < resolvedSize; i += 1) {
          const [value, newOffset] = item.deserialize(bytes, offset);
          values.push(value);
          offset = newOffset;
        }
        return [values, offset];
      }
    };
  }
  
  exports.array = array;
  
  
  },{"./errors.cjs":47,"./utils.cjs":61,"@metaplex-foundation/umi-serializers-core":12,"@metaplex-foundation/umi-serializers-numbers":34}],43:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  
  /* eslint-disable no-bitwise */
  
  /**
   * Defines the options for bitArray serializers.
   * @category Serializers
   */
  
  /**
   * An array of boolean serializer that
   * converts booleans to bits and vice versa.
   *
   * @param size - The amount of bytes to use for the bit array.
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  const bitArray = (size, options = {}) => {
    const parsedOptions = typeof options === 'boolean' ? {
      backward: options
    } : options;
    const backward = parsedOptions.backward ?? false;
    const backwardSuffix = backward ? '; backward' : '';
    return {
      description: parsedOptions.description ?? `bitArray(${size}${backwardSuffix})`,
      fixedSize: size,
      maxSize: size,
      serialize(value) {
        const bytes = [];
        for (let i = 0; i < size; i += 1) {
          let byte = 0;
          for (let j = 0; j < 8; j += 1) {
            const feature = Number(value[i * 8 + j] ?? 0);
            byte |= feature << (backward ? j : 7 - j);
          }
          if (backward) {
            bytes.unshift(byte);
          } else {
            bytes.push(byte);
          }
        }
        return new Uint8Array(bytes);
      },
      deserialize(bytes, offset = 0) {
        const booleans = [];
        let slice = bytes.slice(offset, offset + size);
        slice = backward ? slice.reverse() : slice;
        if (slice.length !== size) {
          throw new umiSerializersCore.NotEnoughBytesError('bitArray', size, slice.length);
        }
        slice.forEach(byte => {
          for (let i = 0; i < 8; i += 1) {
            if (backward) {
              booleans.push(Boolean(byte & 1));
              byte >>= 1;
            } else {
              booleans.push(Boolean(byte & 0b1000_0000));
              byte <<= 1;
            }
          }
        });
        return [booleans, offset + size];
      }
    };
  };
  
  exports.bitArray = bitArray;
  
  
  },{"@metaplex-foundation/umi-serializers-core":12}],44:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var umiSerializersNumbers = require('@metaplex-foundation/umi-serializers-numbers');
  
  /**
   * Defines the options for boolean serializers.
   * @category Serializers
   */
  
  /**
   * Creates a boolean serializer.
   *
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function bool(options = {}) {
    const size = options.size ?? umiSerializersNumbers.u8();
    if (size.fixedSize === null) {
      throw new umiSerializersCore.ExpectedFixedSizeSerializerError('Serializer [bool] requires a fixed size.');
    }
    return {
      description: options.description ?? `bool(${size.description})`,
      fixedSize: size.fixedSize,
      maxSize: size.fixedSize,
      serialize: value => size.serialize(value ? 1 : 0),
      deserialize: (bytes, offset = 0) => {
        if (bytes.slice(offset).length === 0) {
          throw new umiSerializersCore.DeserializingEmptyBufferError('bool');
        }
        const [value, vOffset] = size.deserialize(bytes, offset);
        return [value === 1, vOffset];
      }
    };
  }
  
  exports.bool = bool;
  
  
  },{"@metaplex-foundation/umi-serializers-core":12,"@metaplex-foundation/umi-serializers-numbers":34}],45:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var utils = require('./utils.cjs');
  
  /**
   * Defines the options for bytes serializers.
   * @category Serializers
   */
  
  /**
   * Creates a serializer that passes the buffer as-is.
   *
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function bytes(options = {}) {
    const size = options.size ?? 'variable';
    const description = options.description ?? `bytes(${utils.getSizeDescription(size)})`;
    const byteSerializer = {
      description,
      fixedSize: null,
      maxSize: null,
      serialize: value => new Uint8Array(value),
      deserialize: (bytes, offset = 0) => {
        const slice = bytes.slice(offset);
        return [slice, offset + slice.length];
      }
    };
    if (size === 'variable') {
      return byteSerializer;
    }
    if (typeof size === 'number') {
      return umiSerializersCore.fixSerializer(byteSerializer, size, description);
    }
    return {
      description,
      fixedSize: null,
      maxSize: null,
      serialize: value => {
        const contentBytes = byteSerializer.serialize(value);
        const lengthBytes = size.serialize(contentBytes.length);
        return umiSerializersCore.mergeBytes([lengthBytes, contentBytes]);
      },
      deserialize: (buffer, offset = 0) => {
        if (buffer.slice(offset).length === 0) {
          throw new umiSerializersCore.DeserializingEmptyBufferError('bytes');
        }
        const [lengthBigInt, lengthOffset] = size.deserialize(buffer, offset);
        const length = Number(lengthBigInt);
        offset = lengthOffset;
        const contentBuffer = buffer.slice(offset, offset + length);
        if (contentBuffer.length < length) {
          throw new umiSerializersCore.NotEnoughBytesError('bytes', length, contentBuffer.length);
        }
        const [value, contentOffset] = byteSerializer.deserialize(contentBuffer);
        offset += contentOffset;
        return [value, offset];
      }
    };
  }
  
  exports.bytes = bytes;
  
  
  },{"./utils.cjs":61,"@metaplex-foundation/umi-serializers-core":12}],46:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var umiSerializersNumbers = require('@metaplex-foundation/umi-serializers-numbers');
  var errors = require('./errors.cjs');
  var maxSerializerSizes = require('./maxSerializerSizes.cjs');
  var sumSerializerSizes = require('./sumSerializerSizes.cjs');
  
  /**
   * Defines a data enum using discriminated union types.
   *
   * @example
   * ```ts
   * type WebPageEvent =
   *   | { __kind: 'pageview', url: string }
   *   | { __kind: 'click', x: number, y: number };
   * ```
   *
   * @category Serializers
   */
  
  /**
   * Creates a data enum serializer.
   *
   * @param variants - The variant serializers of the data enum.
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function dataEnum(variants, options = {}) {
    const prefix = options.size ?? umiSerializersNumbers.u8();
    const fieldDescriptions = variants.map(([name, serializer]) => `${String(name)}${serializer ? `: ${serializer.description}` : ''}`).join(', ');
    const allVariantHaveTheSameFixedSize = variants.every((one, i, all) => one[1].fixedSize === all[0][1].fixedSize);
    const fixedVariantSize = allVariantHaveTheSameFixedSize ? variants[0][1].fixedSize : null;
    const maxVariantSize = maxSerializerSizes.maxSerializerSizes(variants.map(([, field]) => field.maxSize));
    return {
      description: options.description ?? `dataEnum(${fieldDescriptions}; ${prefix.description})`,
      fixedSize: variants.length === 0 ? prefix.fixedSize : sumSerializerSizes.sumSerializerSizes([prefix.fixedSize, fixedVariantSize]),
      maxSize: variants.length === 0 ? prefix.maxSize : sumSerializerSizes.sumSerializerSizes([prefix.maxSize, maxVariantSize]),
      serialize: variant => {
        const discriminator = variants.findIndex(([key]) => variant.__kind === key);
        if (discriminator < 0) {
          throw new errors.InvalidDataEnumVariantError(variant.__kind, variants.map(([key]) => key));
        }
        const variantPrefix = prefix.serialize(discriminator);
        const variantSerializer = variants[discriminator][1];
        const variantBytes = variantSerializer.serialize(variant);
        return umiSerializersCore.mergeBytes([variantPrefix, variantBytes]);
      },
      deserialize: (bytes, offset = 0) => {
        if (bytes.slice(offset).length === 0) {
          throw new umiSerializersCore.DeserializingEmptyBufferError('dataEnum');
        }
        const [discriminator, dOffset] = prefix.deserialize(bytes, offset);
        offset = dOffset;
        const variantField = variants[Number(discriminator)] ?? null;
        if (!variantField) {
          throw new errors.EnumDiscriminatorOutOfRangeError(discriminator, 0, variants.length - 1);
        }
        const [variant, vOffset] = variantField[1].deserialize(bytes, offset);
        offset = vOffset;
        return [{
          __kind: variantField[0],
          ...(variant ?? {})
        }, offset];
      }
    };
  }
  
  exports.dataEnum = dataEnum;
  
  
  },{"./errors.cjs":47,"./maxSerializerSizes.cjs":50,"./sumSerializerSizes.cjs":58,"@metaplex-foundation/umi-serializers-core":12,"@metaplex-foundation/umi-serializers-numbers":34}],47:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /** @category Errors */
  class InvalidNumberOfItemsError extends Error {
    name = 'InvalidNumberOfItemsError';
    constructor(serializer, expected, actual) {
      super(`Expected [${serializer}] to have ${expected} items, got ${actual}.`);
    }
  }
  
  /** @category Errors */
  class InvalidArrayLikeRemainderSizeError extends Error {
    name = 'InvalidArrayLikeRemainderSizeError';
    constructor(remainderSize, itemSize) {
      super(`The remainder of the buffer (${remainderSize} bytes) cannot be split into chunks of ${itemSize} bytes. ` + `Serializers of "remainder" size must have a remainder that is a multiple of its item size. ` + `In other words, ${remainderSize} modulo ${itemSize} should be equal to zero.`);
    }
  }
  
  /** @category Errors */
  class UnrecognizedArrayLikeSerializerSizeError extends Error {
    name = 'UnrecognizedArrayLikeSerializerSizeError';
    constructor(size) {
      super(`Unrecognized array-like serializer size: ${JSON.stringify(size)}`);
    }
  }
  
  /** @category Errors */
  class InvalidDataEnumVariantError extends Error {
    name = 'InvalidDataEnumVariantError';
    constructor(invalidVariant, validVariants) {
      super(`Invalid data enum variant. ` + `Expected one of [${validVariants.join(', ')}], ` + `got "${invalidVariant}".`);
    }
  }
  
  /** @category Errors */
  class InvalidScalarEnumVariantError extends Error {
    name = 'InvalidScalarEnumVariantError';
    constructor(invalidVariant, validVariants, min, max) {
      super(`Invalid scalar enum variant. ` + `Expected one of [${validVariants.join(', ')}] ` + `or a number between ${min} and ${max}, ` + `got "${invalidVariant}".`);
    }
  }
  
  /** @category Errors */
  class EnumDiscriminatorOutOfRangeError extends RangeError {
    name = 'EnumDiscriminatorOutOfRangeError';
    constructor(discriminator, min, max) {
      super(`Enum discriminator out of range. ` + `Expected a number between ${min} and ${max}, got ${discriminator}.`);
    }
  }
  
  exports.EnumDiscriminatorOutOfRangeError = EnumDiscriminatorOutOfRangeError;
  exports.InvalidArrayLikeRemainderSizeError = InvalidArrayLikeRemainderSizeError;
  exports.InvalidDataEnumVariantError = InvalidDataEnumVariantError;
  exports.InvalidNumberOfItemsError = InvalidNumberOfItemsError;
  exports.InvalidScalarEnumVariantError = InvalidScalarEnumVariantError;
  exports.UnrecognizedArrayLikeSerializerSizeError = UnrecognizedArrayLikeSerializerSizeError;
  
  
  },{}],48:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var umiSerializersEncodings = require('@metaplex-foundation/umi-serializers-encodings');
  var umiSerializersNumbers = require('@metaplex-foundation/umi-serializers-numbers');
  var array = require('./array.cjs');
  var bitArray = require('./bitArray.cjs');
  var bool = require('./bool.cjs');
  var bytes = require('./bytes.cjs');
  var dataEnum = require('./dataEnum.cjs');
  var errors = require('./errors.cjs');
  var map = require('./map.cjs');
  var nullable = require('./nullable.cjs');
  var option = require('./option.cjs');
  var publicKey = require('./publicKey.cjs');
  var scalarEnum = require('./scalarEnum.cjs');
  var set = require('./set.cjs');
  var string = require('./string.cjs');
  var struct = require('./struct.cjs');
  var tuple = require('./tuple.cjs');
  var unit = require('./unit.cjs');
  var maxSerializerSizes = require('./maxSerializerSizes.cjs');
  var sumSerializerSizes = require('./sumSerializerSizes.cjs');
  
  
  
  exports.array = array.array;
  exports.bitArray = bitArray.bitArray;
  exports.bool = bool.bool;
  exports.bytes = bytes.bytes;
  exports.dataEnum = dataEnum.dataEnum;
  exports.EnumDiscriminatorOutOfRangeError = errors.EnumDiscriminatorOutOfRangeError;
  exports.InvalidArrayLikeRemainderSizeError = errors.InvalidArrayLikeRemainderSizeError;
  exports.InvalidDataEnumVariantError = errors.InvalidDataEnumVariantError;
  exports.InvalidNumberOfItemsError = errors.InvalidNumberOfItemsError;
  exports.InvalidScalarEnumVariantError = errors.InvalidScalarEnumVariantError;
  exports.UnrecognizedArrayLikeSerializerSizeError = errors.UnrecognizedArrayLikeSerializerSizeError;
  exports.map = map.map;
  exports.nullable = nullable.nullable;
  exports.option = option.option;
  exports.publicKey = publicKey.publicKey;
  exports.scalarEnum = scalarEnum.scalarEnum;
  exports.set = set.set;
  exports.string = string.string;
  exports.struct = struct.struct;
  exports.tuple = tuple.tuple;
  exports.unit = unit.unit;
  exports.maxSerializerSizes = maxSerializerSizes.maxSerializerSizes;
  exports.sumSerializerSizes = sumSerializerSizes.sumSerializerSizes;
  Object.keys(umiSerializersCore).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () { return umiSerializersCore[k]; }
    });
  });
  Object.keys(umiSerializersEncodings).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () { return umiSerializersEncodings[k]; }
    });
  });
  Object.keys(umiSerializersNumbers).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () { return umiSerializersNumbers[k]; }
    });
  });
  
  
  },{"./array.cjs":42,"./bitArray.cjs":43,"./bool.cjs":44,"./bytes.cjs":45,"./dataEnum.cjs":46,"./errors.cjs":47,"./map.cjs":49,"./maxSerializerSizes.cjs":50,"./nullable.cjs":51,"./option.cjs":52,"./publicKey.cjs":53,"./scalarEnum.cjs":54,"./set.cjs":55,"./string.cjs":56,"./struct.cjs":57,"./sumSerializerSizes.cjs":58,"./tuple.cjs":59,"./unit.cjs":60,"@metaplex-foundation/umi-serializers-core":12,"@metaplex-foundation/umi-serializers-encodings":22,"@metaplex-foundation/umi-serializers-numbers":34}],49:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var umiSerializersNumbers = require('@metaplex-foundation/umi-serializers-numbers');
  var utils = require('./utils.cjs');
  var errors = require('./errors.cjs');
  
  /**
   * Defines the options for `Map` serializers.
   * @category Serializers
   */
  
  /**
   * Creates a serializer for a map.
   *
   * @param key - The serializer to use for the map's keys.
   * @param value - The serializer to use for the map's values.
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function map(key, value, options = {}) {
    const size = options.size ?? umiSerializersNumbers.u32();
    if (size === 'remainder' && (key.fixedSize === null || value.fixedSize === null)) {
      throw new umiSerializersCore.ExpectedFixedSizeSerializerError('Serializers of "remainder" size must have fixed-size items.');
    }
    return {
      description: options.description ?? `map(${key.description}, ${value.description}; ${utils.getSizeDescription(size)})`,
      fixedSize: utils.getSizeFromChildren(size, [key.fixedSize, value.fixedSize]),
      maxSize: utils.getSizeFromChildren(size, [key.maxSize, value.maxSize]),
      serialize: map => {
        if (typeof size === 'number' && map.size !== size) {
          throw new errors.InvalidNumberOfItemsError('map', size, map.size);
        }
        const itemBytes = Array.from(map, ([k, v]) => umiSerializersCore.mergeBytes([key.serialize(k), value.serialize(v)]));
        return umiSerializersCore.mergeBytes([utils.getSizePrefix(size, map.size), ...itemBytes]);
      },
      deserialize: (bytes, offset = 0) => {
        const map = new Map();
        if (typeof size === 'object' && bytes.slice(offset).length === 0) {
          return [map, offset];
        }
        const [resolvedSize, newOffset] = utils.getResolvedSize(size, [key.fixedSize, value.fixedSize], bytes, offset);
        offset = newOffset;
        for (let i = 0; i < resolvedSize; i += 1) {
          const [deserializedKey, kOffset] = key.deserialize(bytes, offset);
          offset = kOffset;
          const [deserializedValue, vOffset] = value.deserialize(bytes, offset);
          offset = vOffset;
          map.set(deserializedKey, deserializedValue);
        }
        return [map, offset];
      }
    };
  }
  
  exports.map = map;
  
  
  },{"./errors.cjs":47,"./utils.cjs":61,"@metaplex-foundation/umi-serializers-core":12,"@metaplex-foundation/umi-serializers-numbers":34}],50:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  function maxSerializerSizes(sizes) {
    return sizes.reduce((all, size) => all === null || size === null ? null : Math.max(all, size), 0);
  }
  
  exports.maxSerializerSizes = maxSerializerSizes;
  
  
  },{}],51:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var umiSerializersNumbers = require('@metaplex-foundation/umi-serializers-numbers');
  var sumSerializerSizes = require('./sumSerializerSizes.cjs');
  var utils = require('./utils.cjs');
  
  /**
   * Defines the options for `Nullable` serializers.
   * @category Serializers
   */
  
  /**
   * Creates a serializer for an optional value using `null` as the `None` value.
   *
   * @param item - The serializer to use for the value that may be present.
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function nullable(item, options = {}) {
    const prefix = options.prefix ?? umiSerializersNumbers.u8();
    const fixed = options.fixed ?? false;
    let descriptionSuffix = `; ${utils.getSizeDescription(prefix)}`;
    let fixedSize = item.fixedSize === 0 ? prefix.fixedSize : null;
    if (fixed) {
      if (item.fixedSize === null || prefix.fixedSize === null) {
        throw new umiSerializersCore.ExpectedFixedSizeSerializerError('Fixed nullables can only be used with fixed-size serializers');
      }
      descriptionSuffix += '; fixed';
      fixedSize = prefix.fixedSize + item.fixedSize;
    }
    return {
      description: options.description ?? `nullable(${item.description + descriptionSuffix})`,
      fixedSize,
      maxSize: sumSerializerSizes.sumSerializerSizes([prefix.maxSize, item.maxSize]),
      serialize: option => {
        const prefixByte = prefix.serialize(Number(option !== null));
        if (fixed) {
          const itemFixedSize = item.fixedSize;
          const itemBytes = option !== null ? item.serialize(option).slice(0, itemFixedSize) : new Uint8Array(itemFixedSize).fill(0);
          return umiSerializersCore.mergeBytes([prefixByte, itemBytes]);
        }
        const itemBytes = option !== null ? item.serialize(option) : new Uint8Array();
        return umiSerializersCore.mergeBytes([prefixByte, itemBytes]);
      },
      deserialize: (bytes, offset = 0) => {
        if (bytes.slice(offset).length === 0) {
          return [null, offset];
        }
        const fixedOffset = offset + (prefix.fixedSize ?? 0) + (item.fixedSize ?? 0);
        const [isSome, prefixOffset] = prefix.deserialize(bytes, offset);
        offset = prefixOffset;
        if (isSome === 0) {
          return [null, fixed ? fixedOffset : offset];
        }
        const [value, newOffset] = item.deserialize(bytes, offset);
        offset = newOffset;
        return [value, fixed ? fixedOffset : offset];
      }
    };
  }
  
  exports.nullable = nullable;
  
  
  },{"./sumSerializerSizes.cjs":58,"./utils.cjs":61,"@metaplex-foundation/umi-serializers-core":12,"@metaplex-foundation/umi-serializers-numbers":34}],52:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiOptions = require('@metaplex-foundation/umi-options');
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var umiSerializersNumbers = require('@metaplex-foundation/umi-serializers-numbers');
  var sumSerializerSizes = require('./sumSerializerSizes.cjs');
  var utils = require('./utils.cjs');
  
  /**
   * Defines the options for `Option` serializers.
   * @category Serializers
   */
  
  /**
   * Creates a serializer for an optional value using the {@link Option} type.
   *
   * @param item - The serializer to use for the value that may be present.
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function option(item, options = {}) {
    const prefix = options.prefix ?? umiSerializersNumbers.u8();
    const fixed = options.fixed ?? false;
    let descriptionSuffix = `; ${utils.getSizeDescription(prefix)}`;
    let fixedSize = item.fixedSize === 0 ? prefix.fixedSize : null;
    if (fixed) {
      if (item.fixedSize === null || prefix.fixedSize === null) {
        throw new umiSerializersCore.ExpectedFixedSizeSerializerError('Fixed options can only be used with fixed-size serializers');
      }
      descriptionSuffix += '; fixed';
      fixedSize = prefix.fixedSize + item.fixedSize;
    }
    return {
      description: options.description ?? `option(${item.description + descriptionSuffix})`,
      fixedSize,
      maxSize: sumSerializerSizes.sumSerializerSizes([prefix.maxSize, item.maxSize]),
      serialize: optionOrNullable => {
        const option = umiOptions.isOption(optionOrNullable) ? optionOrNullable : umiOptions.wrapNullable(optionOrNullable);
        const prefixByte = prefix.serialize(Number(umiOptions.isSome(option)));
        if (fixed) {
          const itemFixedSize = item.fixedSize;
          const itemBytes = umiOptions.isSome(option) ? item.serialize(option.value).slice(0, itemFixedSize) : new Uint8Array(itemFixedSize).fill(0);
          return umiSerializersCore.mergeBytes([prefixByte, itemBytes]);
        }
        const itemBytes = umiOptions.isSome(option) ? item.serialize(option.value) : new Uint8Array();
        return umiSerializersCore.mergeBytes([prefixByte, itemBytes]);
      },
      deserialize: (bytes, offset = 0) => {
        if (bytes.slice(offset).length === 0) {
          return [umiOptions.none(), offset];
        }
        const fixedOffset = offset + (prefix.fixedSize ?? 0) + (item.fixedSize ?? 0);
        const [isSome, prefixOffset] = prefix.deserialize(bytes, offset);
        offset = prefixOffset;
        if (isSome === 0) {
          return [umiOptions.none(), fixed ? fixedOffset : offset];
        }
        const [value, newOffset] = item.deserialize(bytes, offset);
        offset = newOffset;
        return [umiOptions.some(value), fixed ? fixedOffset : offset];
      }
    };
  }
  
  exports.option = option;
  
  
  },{"./sumSerializerSizes.cjs":58,"./utils.cjs":61,"@metaplex-foundation/umi-options":3,"@metaplex-foundation/umi-serializers-core":12,"@metaplex-foundation/umi-serializers-numbers":34}],53:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiPublicKeys = require('@metaplex-foundation/umi-public-keys');
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  
  /**
   * Defines the options for `PublicKey` serializers.
   * @category Serializers
   */
  
  /**
   * Creates a serializer for base58 encoded public keys.
   *
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function publicKey(options = {}) {
    return {
      description: options.description ?? 'publicKey',
      fixedSize: 32,
      maxSize: 32,
      serialize: value => umiPublicKeys.publicKeyBytes(umiPublicKeys.publicKey(value)),
      deserialize: (bytes, offset = 0) => {
        const pubkeyBytes = bytes.slice(offset, offset + 32);
        if (pubkeyBytes.length === 0) {
          throw new umiSerializersCore.DeserializingEmptyBufferError('publicKey');
        }
        if (pubkeyBytes.length < umiPublicKeys.PUBLIC_KEY_LENGTH) {
          throw new umiSerializersCore.NotEnoughBytesError('publicKey', umiPublicKeys.PUBLIC_KEY_LENGTH, pubkeyBytes.length);
        }
        return [umiPublicKeys.publicKey(pubkeyBytes), offset + 32];
      }
    };
  }
  
  exports.publicKey = publicKey;
  
  
  },{"@metaplex-foundation/umi-public-keys":8,"@metaplex-foundation/umi-serializers-core":12}],54:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var umiSerializersNumbers = require('@metaplex-foundation/umi-serializers-numbers');
  var errors = require('./errors.cjs');
  
  /**
   * Defines a scalar enum as a type from its constructor.
   *
   * @example
   * ```ts
   * enum Direction { Left, Right };
   * type DirectionType = ScalarEnum<Direction>;
   * ```
   *
   * @category Serializers
   */
  
  /**
   * Creates a scalar enum serializer.
   *
   * @param constructor - The constructor of the scalar enum.
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function scalarEnum(constructor, options = {}) {
    const prefix = options.size ?? umiSerializersNumbers.u8();
    const enumKeys = Object.keys(constructor);
    const enumValues = Object.values(constructor);
    const isNumericEnum = enumValues.some(v => typeof v === 'number');
    const valueDescriptions = enumValues.filter(v => typeof v === 'string').join(', ');
    const minRange = 0;
    const maxRange = isNumericEnum ? enumValues.length / 2 - 1 : enumValues.length - 1;
    const stringValues = isNumericEnum ? [...enumKeys] : [...new Set([...enumKeys, ...enumValues])];
    function assertValidVariant(variant) {
      const isInvalidNumber = typeof variant === 'number' && (variant < minRange || variant > maxRange);
      const isInvalidString = typeof variant === 'string' && !stringValues.includes(variant);
      if (isInvalidNumber || isInvalidString) {
        throw new errors.InvalidScalarEnumVariantError(variant, stringValues, minRange, maxRange);
      }
    }
    return {
      description: options.description ?? `enum(${valueDescriptions}; ${prefix.description})`,
      fixedSize: prefix.fixedSize,
      maxSize: prefix.maxSize,
      serialize: value => {
        assertValidVariant(value);
        if (typeof value === 'number') return prefix.serialize(value);
        const valueIndex = enumValues.indexOf(value);
        if (valueIndex >= 0) return prefix.serialize(valueIndex);
        return prefix.serialize(enumKeys.indexOf(value));
      },
      deserialize: (bytes, offset = 0) => {
        if (bytes.slice(offset).length === 0) {
          throw new umiSerializersCore.DeserializingEmptyBufferError('enum');
        }
        const [value, newOffset] = prefix.deserialize(bytes, offset);
        const valueAsNumber = Number(value);
        offset = newOffset;
        if (valueAsNumber < minRange || valueAsNumber > maxRange) {
          throw new errors.EnumDiscriminatorOutOfRangeError(valueAsNumber, minRange, maxRange);
        }
        return [isNumericEnum ? valueAsNumber : enumValues[valueAsNumber], offset];
      }
    };
  }
  
  exports.scalarEnum = scalarEnum;
  
  
  },{"./errors.cjs":47,"@metaplex-foundation/umi-serializers-core":12,"@metaplex-foundation/umi-serializers-numbers":34}],55:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var umiSerializersNumbers = require('@metaplex-foundation/umi-serializers-numbers');
  var utils = require('./utils.cjs');
  var errors = require('./errors.cjs');
  
  /**
   * Defines the options for `Set` serializers.
   * @category Serializers
   */
  
  /**
   * Creates a serializer for a set.
   *
   * @param item - The serializer to use for the set's items.
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function set(item, options = {}) {
    const size = options.size ?? umiSerializersNumbers.u32();
    if (size === 'remainder' && item.fixedSize === null) {
      throw new umiSerializersCore.ExpectedFixedSizeSerializerError('Serializers of "remainder" size must have fixed-size items.');
    }
    return {
      description: options.description ?? `set(${item.description}; ${utils.getSizeDescription(size)})`,
      fixedSize: utils.getSizeFromChildren(size, [item.fixedSize]),
      maxSize: utils.getSizeFromChildren(size, [item.maxSize]),
      serialize: set => {
        if (typeof size === 'number' && set.size !== size) {
          throw new errors.InvalidNumberOfItemsError('set', size, set.size);
        }
        const itemBytes = Array.from(set, value => item.serialize(value));
        return umiSerializersCore.mergeBytes([utils.getSizePrefix(size, set.size), ...itemBytes]);
      },
      deserialize: (bytes, offset = 0) => {
        const set = new Set();
        if (typeof size === 'object' && bytes.slice(offset).length === 0) {
          return [set, offset];
        }
        const [resolvedSize, newOffset] = utils.getResolvedSize(size, [item.fixedSize], bytes, offset);
        offset = newOffset;
        for (let i = 0; i < resolvedSize; i += 1) {
          const [value, newOffset] = item.deserialize(bytes, offset);
          offset = newOffset;
          set.add(value);
        }
        return [set, offset];
      }
    };
  }
  
  exports.set = set;
  
  
  },{"./errors.cjs":47,"./utils.cjs":61,"@metaplex-foundation/umi-serializers-core":12,"@metaplex-foundation/umi-serializers-numbers":34}],56:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var umiSerializersEncodings = require('@metaplex-foundation/umi-serializers-encodings');
  var umiSerializersNumbers = require('@metaplex-foundation/umi-serializers-numbers');
  var utils = require('./utils.cjs');
  
  /**
   * Defines the options for string serializers.
   * @category Serializers
   */
  
  /**
   * Creates a string serializer.
   *
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function string(options = {}) {
    const size = options.size ?? umiSerializersNumbers.u32();
    const encoding = options.encoding ?? umiSerializersEncodings.utf8;
    const description = options.description ?? `string(${encoding.description}; ${utils.getSizeDescription(size)})`;
    if (size === 'variable') {
      return {
        ...encoding,
        description
      };
    }
    if (typeof size === 'number') {
      return umiSerializersCore.fixSerializer(encoding, size, description);
    }
    return {
      description,
      fixedSize: null,
      maxSize: null,
      serialize: value => {
        const contentBytes = encoding.serialize(value);
        const lengthBytes = size.serialize(contentBytes.length);
        return umiSerializersCore.mergeBytes([lengthBytes, contentBytes]);
      },
      deserialize: (buffer, offset = 0) => {
        if (buffer.slice(offset).length === 0) {
          throw new umiSerializersCore.DeserializingEmptyBufferError('string');
        }
        const [lengthBigInt, lengthOffset] = size.deserialize(buffer, offset);
        const length = Number(lengthBigInt);
        offset = lengthOffset;
        const contentBuffer = buffer.slice(offset, offset + length);
        if (contentBuffer.length < length) {
          throw new umiSerializersCore.NotEnoughBytesError('string', length, contentBuffer.length);
        }
        const [value, contentOffset] = encoding.deserialize(contentBuffer);
        offset += contentOffset;
        return [value, offset];
      }
    };
  }
  
  exports.string = string;
  
  
  },{"./utils.cjs":61,"@metaplex-foundation/umi-serializers-core":12,"@metaplex-foundation/umi-serializers-encodings":22,"@metaplex-foundation/umi-serializers-numbers":34}],57:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var sumSerializerSizes = require('./sumSerializerSizes.cjs');
  
  /**
   * Get the name and serializer of each field in a struct.
   * @category Serializers
   */
  
  /**
   * Creates a serializer for a custom object.
   *
   * @param fields - The name and serializer of each field.
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function struct(fields, options = {}) {
    const fieldDescriptions = fields.map(([name, serializer]) => `${String(name)}: ${serializer.description}`).join(', ');
    return {
      description: options.description ?? `struct(${fieldDescriptions})`,
      fixedSize: sumSerializerSizes.sumSerializerSizes(fields.map(([, field]) => field.fixedSize)),
      maxSize: sumSerializerSizes.sumSerializerSizes(fields.map(([, field]) => field.maxSize)),
      serialize: struct => {
        const fieldBytes = fields.map(([key, serializer]) => serializer.serialize(struct[key]));
        return umiSerializersCore.mergeBytes(fieldBytes);
      },
      deserialize: (bytes, offset = 0) => {
        const struct = {};
        fields.forEach(([key, serializer]) => {
          const [value, newOffset] = serializer.deserialize(bytes, offset);
          offset = newOffset;
          struct[key] = value;
        });
        return [struct, offset];
      }
    };
  }
  
  exports.struct = struct;
  
  
  },{"./sumSerializerSizes.cjs":58,"@metaplex-foundation/umi-serializers-core":12}],58:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  function sumSerializerSizes(sizes) {
    return sizes.reduce((all, size) => all === null || size === null ? null : all + size, 0);
  }
  
  exports.sumSerializerSizes = sumSerializerSizes;
  
  
  },{}],59:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var sumSerializerSizes = require('./sumSerializerSizes.cjs');
  var errors = require('./errors.cjs');
  
  /**
   * Defines the options for tuple serializers.
   * @category Serializers
   */
  
  /**
   * Creates a serializer for a tuple-like array.
   *
   * @param items - The serializers to use for each item in the tuple.
   * @param options - A set of options for the serializer.
   * @category Serializers
   */
  function tuple(items, options = {}) {
    const itemDescriptions = items.map(item => item.description).join(', ');
    return {
      description: options.description ?? `tuple(${itemDescriptions})`,
      fixedSize: sumSerializerSizes.sumSerializerSizes(items.map(item => item.fixedSize)),
      maxSize: sumSerializerSizes.sumSerializerSizes(items.map(item => item.maxSize)),
      serialize: value => {
        if (value.length !== items.length) {
          throw new errors.InvalidNumberOfItemsError('tuple', items.length, value.length);
        }
        return umiSerializersCore.mergeBytes(items.map((item, index) => item.serialize(value[index])));
      },
      deserialize: (bytes, offset = 0) => {
        const values = [];
        items.forEach(serializer => {
          const [newValue, newOffset] = serializer.deserialize(bytes, offset);
          values.push(newValue);
          offset = newOffset;
        });
        return [values, offset];
      }
    };
  }
  
  exports.tuple = tuple;
  
  
  },{"./errors.cjs":47,"./sumSerializerSizes.cjs":58,"@metaplex-foundation/umi-serializers-core":12}],60:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /**
   * Defines the options for unit serializers.
   * @category Serializers
   */
  
  /**
   * Creates a void serializer.
   *
   * @param options - A set of options for the serializer.
   */
  function unit(options = {}) {
    return {
      description: options.description ?? 'unit',
      fixedSize: 0,
      maxSize: 0,
      serialize: () => new Uint8Array(),
      deserialize: (_bytes, offset = 0) => [undefined, offset]
    };
  }
  
  exports.unit = unit;
  
  
  },{}],61:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializersCore = require('@metaplex-foundation/umi-serializers-core');
  var errors = require('./errors.cjs');
  var sumSerializerSizes = require('./sumSerializerSizes.cjs');
  
  function getResolvedSize(size, childrenSizes, bytes, offset) {
    if (typeof size === 'number') {
      return [size, offset];
    }
    if (typeof size === 'object') {
      return size.deserialize(bytes, offset);
    }
    if (size === 'remainder') {
      const childrenSize = sumSerializerSizes.sumSerializerSizes(childrenSizes);
      if (childrenSize === null) {
        throw new umiSerializersCore.ExpectedFixedSizeSerializerError('Serializers of "remainder" size must have fixed-size items.');
      }
      const remainder = bytes.slice(offset).length;
      if (remainder % childrenSize !== 0) {
        throw new errors.InvalidArrayLikeRemainderSizeError(remainder, childrenSize);
      }
      return [remainder / childrenSize, offset];
    }
    throw new errors.UnrecognizedArrayLikeSerializerSizeError(size);
  }
  function getSizeDescription(size) {
    return typeof size === 'object' ? size.description : `${size}`;
  }
  function getSizeFromChildren(size, childrenSizes) {
    if (typeof size !== 'number') return null;
    if (size === 0) return 0;
    const childrenSize = sumSerializerSizes.sumSerializerSizes(childrenSizes);
    return childrenSize === null ? null : childrenSize * size;
  }
  function getSizePrefix(size, realSize) {
    return typeof size === 'object' ? size.serialize(realSize) : new Uint8Array();
  }
  
  exports.getResolvedSize = getResolvedSize;
  exports.getSizeDescription = getSizeDescription;
  exports.getSizeFromChildren = getSizeFromChildren;
  exports.getSizePrefix = getSizePrefix;
  
  
  },{"./errors.cjs":47,"./sumSerializerSizes.cjs":58,"@metaplex-foundation/umi-serializers-core":12}],62:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var UnexpectedAccountError = require('./errors/UnexpectedAccountError.cjs');
  var AccountNotFoundError = require('./errors/AccountNotFoundError.cjs');
  
  /**
   * The size of an account header in bytes.
   * @category Accounts
   */
  const ACCOUNT_HEADER_SIZE = 128;
  
  /**
   * Describes the header of an account.
   * @category Accounts
   */
  
  /**
   * Given an account data serializer,
   * returns a deserialized account from a raw account.
   * @category Accounts
   */
  function deserializeAccount(rawAccount, dataSerializer) {
    const {
      data,
      publicKey,
      ...rest
    } = rawAccount;
    try {
      const [parsedData] = dataSerializer.deserialize(data);
      return {
        publicKey,
        header: rest,
        ...parsedData
      };
    } catch (error) {
      throw new UnexpectedAccountError.UnexpectedAccountError(publicKey, dataSerializer.description, error);
    }
  }
  
  /**
   * Ensures an account that may or may not exist actually exists.
   * @category Accounts
   */
  function assertAccountExists(account, name, solution) {
    if (!account.exists) {
      throw new AccountNotFoundError.AccountNotFoundError(account.publicKey, name, solution);
    }
  }
  
  exports.ACCOUNT_HEADER_SIZE = ACCOUNT_HEADER_SIZE;
  exports.assertAccountExists = assertAccountExists;
  exports.deserializeAccount = deserializeAccount;
  
  
  },{"./errors/AccountNotFoundError.cjs":87,"./errors/UnexpectedAccountError.cjs":94}],63:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializers = require('@metaplex-foundation/umi-serializers');
  var BigInt$1 = require('./BigInt.cjs');
  var UnexpectedAmountError = require('./errors/UnexpectedAmountError.cjs');
  var AmountMismatchError = require('./errors/AmountMismatchError.cjs');
  
  /**
   * The identifier of an amount.
   * @category Utils â€” Amounts
   */
  
  /**
   * Creates an amount from the provided basis points, identifier, and decimals.
   * @category Utils â€” Amounts
   */
  const createAmount = (basisPoints, identifier, decimals) => ({
    basisPoints: BigInt$1.createBigInt(basisPoints),
    identifier,
    decimals
  });
  
  /**
   * Creates an amount from a decimal value which will be converted to the lowest
   * possible unit using the provided decimals.
   * @category Utils â€” Amounts
   */
  const createAmountFromDecimals = (decimalAmount, identifier, decimals) => {
    const exponentAmount = createAmount(BigInt(10) ** BigInt(decimals ?? 0), identifier, decimals);
    return multiplyAmount(exponentAmount, decimalAmount);
  };
  
  /**
   * Creates a percentage amount from the provided decimal value.
   * @category Utils â€” Amounts
   */
  const percentAmount = (percent, decimals = 2) => createAmountFromDecimals(percent, '%', decimals);
  
  /**
   * Creates an amount of SPL tokens from the provided decimal value.
   * @category Utils â€” Amounts
   */
  const tokenAmount = (tokens, identifier, decimals) => createAmountFromDecimals(tokens, identifier ?? 'splToken', decimals ?? 0);
  
  /**
   * Creates a {@link SolAmount} from the provided lamports.
   * @category Utils â€” Amounts
   */
  const lamports = lamports => createAmount(lamports, 'SOL', 9);
  
  /**
   * Creates a {@link SolAmount} from the provided decimal value in SOL.
   * @category Utils â€” Amounts
   */
  const sol = sol => createAmountFromDecimals(sol, 'SOL', 9);
  
  /**
   * Creates a {@link UsdAmount} from the provided decimal value in USD.
   * @category Utils â€” Amounts
   */
  const usd = usd => createAmountFromDecimals(usd, 'USD', 2);
  
  /**
   * Determines whether a given amount has the provided identifier and decimals.
   * @category Utils â€” Amounts
   */
  const isAmount = (amount, identifier, decimals) => amount.identifier === identifier && amount.decimals === decimals;
  
  /**
   * Determines whether a given amount is a {@link SolAmount}.
   * @category Utils â€” Amounts
   */
  const isSolAmount = amount => isAmount(amount, 'SOL', 9);
  
  /**
   * Determines whether two amounts are of the same type.
   * @category Utils â€” Amounts
   */
  const sameAmounts = (left, right) => isAmount(left, right.identifier, right.decimals);
  
  /**
   * Ensures that a given amount has the provided identifier and decimals.
   * @category Utils â€” Amounts
   */
  function assertAmount(amount, identifier, decimals) {
    if (!isAmount(amount, identifier, decimals)) {
      throw new UnexpectedAmountError.UnexpectedAmountError(amount, identifier, decimals);
    }
  }
  
  /**
   * Ensures that a given amount is a {@link SolAmount}.
   * @category Utils â€” Amounts
   */
  function assertSolAmount(actual) {
    assertAmount(actual, 'SOL', 9);
  }
  
  /**
   * Ensures that two amounts are of the same type.
   * @category Utils â€” Amounts
   */
  function assertSameAmounts(left, right, operation) {
    if (!sameAmounts(left, right)) {
      throw new AmountMismatchError.AmountMismatchError(left, right, operation);
    }
  }
  
  /**
   * Adds two amounts of the same type.
   * @category Utils â€” Amounts
   */
  const addAmounts = (left, right) => {
    assertSameAmounts(left, right, 'add');
    return {
      ...left,
      basisPoints: left.basisPoints + right.basisPoints
    };
  };
  
  /**
   * Subtracts two amounts of the same type.
   * @category Utils â€” Amounts
   */
  const subtractAmounts = (left, right) => {
    assertSameAmounts(left, right, 'subtract');
    return {
      ...left,
      basisPoints: left.basisPoints - right.basisPoints
    };
  };
  
  /**
   * Multiplies an amount by a given multiplier.
   * @category Utils â€” Amounts
   */
  const multiplyAmount = (left, multiplier) => {
    if (typeof multiplier === 'bigint') {
      return {
        ...left,
        basisPoints: left.basisPoints * multiplier
      };
    }
    const [units, decimals] = multiplier.toString().split('.');
    const multiplierBasisPoints = BigInt(units + (decimals ?? ''));
    const multiplierExponents = BigInt(10) ** BigInt(decimals?.length ?? 0);
    return {
      ...left,
      basisPoints: left.basisPoints * multiplierBasisPoints / multiplierExponents
    };
  };
  
  /**
   * Divides an amount by a given divisor.
   * @category Utils â€” Amounts
   */
  const divideAmount = (left, divisor) => {
    if (typeof divisor === 'bigint') {
      return {
        ...left,
        basisPoints: left.basisPoints / divisor
      };
    }
    const [units, decimals] = divisor.toString().split('.');
    const divisorBasisPoints = BigInt(units + (decimals ?? ''));
    const divisorExponents = BigInt(10) ** BigInt(decimals?.length ?? 0);
    return {
      ...left,
      basisPoints: left.basisPoints * divisorExponents / divisorBasisPoints
    };
  };
  
  /**
   * Returns the absolute value of an amount.
   * @category Utils â€” Amounts
   */
  const absoluteAmount = value => {
    const x = value.basisPoints;
    return {
      ...value,
      basisPoints: x < 0 ? -x : x
    };
  };
  
  /**
   * Compares two amounts of the same type.
   * @category Utils â€” Amounts
   */
  const compareAmounts = (left, right) => {
    assertSameAmounts(left, right, 'compare');
    if (left.basisPoints > right.basisPoints) return 1;
    if (left.basisPoints < right.basisPoints) return -1;
    return 0;
  };
  
  /**
   * Determines whether two amounts are equal.
   * An optional tolerance can be provided to allow for small differences.
   * When using {@link SolAmount}, this is usually due to transaction or small storage fees.
   * @category Utils â€” Amounts
   */
  const isEqualToAmount = (left, right, tolerance) => {
    tolerance = tolerance ?? createAmount(0, left.identifier, left.decimals);
    assertSameAmounts(left, right, 'isEqualToAmount');
    assertSameAmounts(left, tolerance, 'isEqualToAmount');
    const delta = absoluteAmount(subtractAmounts(left, right));
    return isLessThanOrEqualToAmount(delta, tolerance);
  };
  
  /**
   * Whether the left amount is less than the right amount.
   * @category Utils â€” Amounts
   */
  const isLessThanAmount = (left, right) => compareAmounts(left, right) < 0;
  
  /**
   * Whether the left amount is less than or equal to the right amount.
   * @category Utils â€” Amounts
   */
  const isLessThanOrEqualToAmount = (left, right) => compareAmounts(left, right) <= 0;
  
  /**
   * Whether the left amount is greater than the right amount.
   * @category Utils â€” Amounts
   */
  const isGreaterThanAmount = (left, right) => compareAmounts(left, right) > 0;
  
  /**
   * Whether the left amount is greater than or equal to the right amount.
   * @category Utils â€” Amounts
   */
  const isGreaterThanOrEqualToAmount = (left, right) => compareAmounts(left, right) >= 0;
  
  /**
   * Whether the amount is zero.
   * @category Utils â€” Amounts
   */
  const isZeroAmount = value => value.basisPoints === BigInt(0);
  
  /**
   * Whether the amount is positive.
   * @category Utils â€” Amounts
   */
  const isPositiveAmount = value => value.basisPoints >= BigInt(0);
  
  /**
   * Whether the amount is negative.
   * @category Utils â€” Amounts
   */
  const isNegativeAmount = value => value.basisPoints < BigInt(0);
  
  /**
   * Converts an amount to a string by using the amount's decimals.
   * @category Utils â€” Amounts
   */
  const amountToString = (value, maxDecimals) => {
    let text = value.basisPoints.toString();
    if (value.decimals === 0) {
      return text;
    }
    const sign = text.startsWith('-') ? '-' : '';
    text = text.replace('-', '');
    text = text.padStart(value.decimals + 1, '0');
    const units = text.slice(0, -value.decimals);
    let decimals = text.slice(-value.decimals);
    if (maxDecimals !== undefined) {
      decimals = decimals.slice(0, maxDecimals);
    }
    return `${sign + units}.${decimals}`;
  };
  
  /**
   * Converts an amount to a number by using the amount's decimals.
   * Note that this may throw an error if the amount is too large to fit in a JavaScript number.
   * @category Utils â€” Amounts
   */
  const amountToNumber = value => parseFloat(amountToString(value));
  
  /**
   * Displays an amount as a string by using the amount's decimals and identifier.
   * @category Utils â€” Amounts
   */
  const displayAmount = (value, maxDecimals) => {
    const amountAsString = amountToString(value, maxDecimals);
    switch (value.identifier) {
      case '%':
        return `${amountAsString}%`;
      case 'splToken':
        return /^1(\.0+)?$/.test(amountAsString) ? `${amountAsString} Token` : `${amountAsString} Tokens`;
      default:
        if (value.identifier.startsWith('splToken.')) {
          const [, identifier] = value.identifier.split('.');
          return `${identifier} ${amountAsString}`;
        }
        return `${value.identifier} ${amountAsString}`;
    }
  };
  
  /**
   * Converts a number serializer into an amount serializer
   * by providing an amount identifier and decimals.
   * @category Utils â€” Amounts
   */
  const mapAmountSerializer = (serializer, identifier, decimals) => umiSerializers.mapSerializer(serializer, value => value.basisPoints > Number.MAX_SAFE_INTEGER ? value.basisPoints : Number(value.basisPoints), value => createAmount(value, identifier, decimals));
  
  exports.absoluteAmount = absoluteAmount;
  exports.addAmounts = addAmounts;
  exports.amountToNumber = amountToNumber;
  exports.amountToString = amountToString;
  exports.assertAmount = assertAmount;
  exports.assertSameAmounts = assertSameAmounts;
  exports.assertSolAmount = assertSolAmount;
  exports.compareAmounts = compareAmounts;
  exports.createAmount = createAmount;
  exports.createAmountFromDecimals = createAmountFromDecimals;
  exports.displayAmount = displayAmount;
  exports.divideAmount = divideAmount;
  exports.isAmount = isAmount;
  exports.isEqualToAmount = isEqualToAmount;
  exports.isGreaterThanAmount = isGreaterThanAmount;
  exports.isGreaterThanOrEqualToAmount = isGreaterThanOrEqualToAmount;
  exports.isLessThanAmount = isLessThanAmount;
  exports.isLessThanOrEqualToAmount = isLessThanOrEqualToAmount;
  exports.isNegativeAmount = isNegativeAmount;
  exports.isPositiveAmount = isPositiveAmount;
  exports.isSolAmount = isSolAmount;
  exports.isZeroAmount = isZeroAmount;
  exports.lamports = lamports;
  exports.mapAmountSerializer = mapAmountSerializer;
  exports.multiplyAmount = multiplyAmount;
  exports.percentAmount = percentAmount;
  exports.sameAmounts = sameAmounts;
  exports.sol = sol;
  exports.subtractAmounts = subtractAmounts;
  exports.tokenAmount = tokenAmount;
  exports.usd = usd;
  
  
  },{"./BigInt.cjs":64,"./errors/AmountMismatchError.cjs":88,"./errors/UnexpectedAmountError.cjs":95,"@metaplex-foundation/umi-serializers":48}],64:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /**
   * Defines all the types that can be used to create
   * a BigInt via the <code>{@link createBigInt}</code> function.
   * @category Utils â€” Amounts
   */
  
  /**
   * Creates a BigInt from a number, string, boolean, or Uint8Array.
   * @category Utils â€” Amounts
   */
  const createBigInt = input => {
    input = typeof input === 'object' ? input.toString() : input;
    return BigInt(input);
  };
  
  exports.createBigInt = createBigInt;
  
  
  },{}],65:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /**
   * Defines the available Solana clusters.
   * @category Utils â€” Cluster
   */
  
  /**
   * Helper type to helps the end-user selecting a cluster.
   * They can either provide a specific cluster or use the
   * special values 'current' or '*' to select the current
   * cluster or all clusters respectively.
   * @category Utils â€” Cluster
   */
  
  const MAINNET_BETA_DOMAINS = ['api.mainnet-beta.solana.com', 'ssc-dao.genesysgo.net'];
  const DEVNET_DOMAINS = ['api.devnet.solana.com', 'psytrbhymqlkfrhudd.dev.genesysgo.net'];
  const TESTNET_DOMAINS = ['api.testnet.solana.com'];
  const LOCALNET_DOMAINS = ['localhost', '127.0.0.1'];
  
  /**
   * Helper method that tries its best to resolve a cluster from a given endpoint.
   * @category Utils â€” Cluster
   */
  const resolveClusterFromEndpoint = endpoint => {
    const domain = new URL(endpoint).hostname;
    if (MAINNET_BETA_DOMAINS.includes(domain)) return 'mainnet-beta';
    if (DEVNET_DOMAINS.includes(domain)) return 'devnet';
    if (TESTNET_DOMAINS.includes(domain)) return 'testnet';
    if (LOCALNET_DOMAINS.includes(domain)) return 'localnet';
    if (endpoint.includes('mainnet')) return 'mainnet-beta';
    if (endpoint.includes('devnet')) return 'devnet';
    if (endpoint.includes('testnet')) return 'testnet';
    if (endpoint.includes('local')) return 'localnet';
    return 'custom';
  };
  
  exports.resolveClusterFromEndpoint = resolveClusterFromEndpoint;
  
  
  },{}],66:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var DownloaderInterface = require('./DownloaderInterface.cjs');
  var EddsaInterface = require('./EddsaInterface.cjs');
  var HttpInterface = require('./HttpInterface.cjs');
  var ProgramRepositoryInterface = require('./ProgramRepositoryInterface.cjs');
  var RpcInterface = require('./RpcInterface.cjs');
  var SerializerInterface = require('./SerializerInterface.cjs');
  var Signer = require('./Signer.cjs');
  var TransactionFactoryInterface = require('./TransactionFactoryInterface.cjs');
  var UploaderInterface = require('./UploaderInterface.cjs');
  
  /**
   * A Umi context object that uses all of the interfaces provided by Umi.
   * Once created, the end-user can pass this object to any function that
   * requires some or all of these interfaces.
   *
   * @category Context and Interfaces
   */
  
  /**
   * A helper method that creates a Umi context object using only
   * Null implementations of the interfaces. This can be useful to
   * create a full Umi context object when only a few of the interfaces
   * are needed.
   *
   * @category Context and Interfaces
   */
  const createNullContext = () => ({
    downloader: DownloaderInterface.createNullDownloader(),
    eddsa: EddsaInterface.createNullEddsa(),
    http: HttpInterface.createNullHttp(),
    identity: Signer.createNullSigner(),
    payer: Signer.createNullSigner(),
    programs: ProgramRepositoryInterface.createNullProgramRepository(),
    rpc: RpcInterface.createNullRpc(),
    serializer: SerializerInterface.createNullSerializer(),
    transactions: TransactionFactoryInterface.createNullTransactionFactory(),
    uploader: UploaderInterface.createNullUploader()
  });
  
  exports.createNullContext = createNullContext;
  
  
  },{"./DownloaderInterface.cjs":68,"./EddsaInterface.cjs":69,"./HttpInterface.cjs":72,"./ProgramRepositoryInterface.cjs":76,"./RpcInterface.cjs":77,"./SerializerInterface.cjs":78,"./Signer.cjs":79,"./TransactionFactoryInterface.cjs":84,"./UploaderInterface.cjs":86}],67:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializers = require('@metaplex-foundation/umi-serializers');
  var BigInt = require('./BigInt.cjs');
  
  /**
   * Defines a string that can be parsed into a Date object.
   * For instance, `"2020-01-01T00:00:00.000Z"`.
   * @category Utils â€” DateTime
   */
  
  /**
   * Creates a {@link DateTime} from a {@link DateTimeInput}.
   * @category Utils â€” DateTime
   */
  const dateTime = value => {
    if (typeof value === 'string' || isDateObject(value)) {
      const date = new Date(value);
      const timestamp = Math.floor(date.getTime() / 1000);
      return BigInt.createBigInt(timestamp);
    }
    return BigInt.createBigInt(value);
  };
  
  /**
   * Helper function to get the current time as a {@link DateTime}.
   * @category Utils â€” DateTime
   */
  const now = () => dateTime(new Date(Date.now()));
  
  /**
   * Whether the given value is a Date object.
   * @category Utils â€” DateTime
   */
  const isDateObject = value => Object.prototype.toString.call(value) === '[object Date]';
  
  /**
   * Formats a {@link DateTime} as a string.
   * @category Utils â€” DateTime
   */
  const formatDateTime = (value, locales = 'en-US', options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }) => {
    const date = new Date(Number(value * 1000n));
    return date.toLocaleDateString(locales, options);
  };
  
  /**
   * Converts a number serializer into a DateTime serializer.
   * @category Utils â€” DateTime
   */
  const mapDateTimeSerializer = serializer => umiSerializers.mapSerializer(serializer, value => {
    const date = dateTime(value);
    return date > Number.MAX_SAFE_INTEGER ? date : Number(date);
  }, value => dateTime(value));
  
  exports.dateTime = dateTime;
  exports.formatDateTime = formatDateTime;
  exports.mapDateTimeSerializer = mapDateTimeSerializer;
  exports.now = now;
  
  
  },{"./BigInt.cjs":64,"@metaplex-foundation/umi-serializers":48}],68:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var InterfaceImplementationMissingError = require('./errors/InterfaceImplementationMissingError.cjs');
  
  /**
   * An implementation of the {@link DownloaderInterface} that throws an error when called.
   * @category Storage
   */
  function createNullDownloader() {
    const errorHandler = () => {
      throw new InterfaceImplementationMissingError.InterfaceImplementationMissingError('DownloaderInterface', 'downloader');
    };
    return {
      download: errorHandler,
      downloadJson: errorHandler
    };
  }
  
  exports.createNullDownloader = createNullDownloader;
  
  
  },{"./errors/InterfaceImplementationMissingError.cjs":89}],69:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var InterfaceImplementationMissingError = require('./errors/InterfaceImplementationMissingError.cjs');
  
  /**
   * An implementation of the {@link EddsaInterface} that throws an error when called.
   * @category Signers and PublicKeys
   */
  function createNullEddsa() {
    const errorHandler = () => {
      throw new InterfaceImplementationMissingError.InterfaceImplementationMissingError('EddsaInterface', 'eddsa');
    };
    return {
      generateKeypair: errorHandler,
      createKeypairFromSecretKey: errorHandler,
      createKeypairFromSeed: errorHandler,
      isOnCurve: errorHandler,
      findPda: errorHandler,
      sign: errorHandler,
      verify: errorHandler
    };
  }
  
  exports.createNullEddsa = createNullEddsa;
  
  
  },{"./errors/InterfaceImplementationMissingError.cjs":89}],70:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializers = require('@metaplex-foundation/umi-serializers');
  var randomStrings = require('./utils/randomStrings.cjs');
  
  /**
   * A generic definition of a File represented as a buffer with
   * extra metadata such as a file name, content type, and tags.
   *
   * @category Storage
   */
  
  /**
   * Creates a new {@link GenericFile} from a buffer and a file name.
   * @category Storage
   */
  const createGenericFile = (content, fileName, options = {}) => ({
    buffer: typeof content === 'string' ? umiSerializers.utf8.serialize(content) : content,
    fileName,
    displayName: options.displayName ?? fileName,
    uniqueName: options.uniqueName ?? randomStrings.generateRandomString(),
    contentType: options.contentType ?? null,
    extension: options.extension ?? getExtension(fileName),
    tags: options.tags ?? []
  });
  
  /**
   * Creates a new {@link GenericFile} from a {@link BrowserFile}.
   * @category Storage
   */
  const createGenericFileFromBrowserFile = async (browserFile, options = {}) => createGenericFile(new Uint8Array(await browserFile.arrayBuffer()), browserFile.name, options);
  
  /**
   * Creates a new {@link GenericFile} from a JSON object.
   * @category Storage
   */
  const createGenericFileFromJson = (json, fileName = 'inline.json', options = {}) => createGenericFile(JSON.stringify(json), fileName, {
    contentType: 'application/json',
    ...options
  });
  
  /**
   * Creates a new {@link BrowserFile} from a {@link GenericFile}.
   * @category Storage
   */
  const createBrowserFileFromGenericFile = file => new File([file.buffer], file.fileName);
  
  /**
   * Returns the content of a {@link GenericFile} as a parsed JSON object.
   * @category Storage
   */
  const parseJsonFromGenericFile = file => JSON.parse(new TextDecoder().decode(file.buffer));
  
  /**
   * Returns the total size of a list of {@link GenericFile} in bytes.
   * @category Storage
   */
  const getBytesFromGenericFiles = (...files) => files.reduce((acc, file) => acc + file.buffer.byteLength, 0);
  
  /**
   * Whether the given value is a {@link GenericFile}.
   * @category Storage
   */
  const isGenericFile = file => file != null && typeof file === 'object' && 'buffer' in file && 'fileName' in file && 'displayName' in file && 'uniqueName' in file && 'contentType' in file && 'extension' in file && 'tags' in file;
  
  /**
   * Returns the extension of a file name.
   * @category Storage
   */
  const getExtension = fileName => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex < 0 ? null : fileName.slice(lastDotIndex + 1);
  };
  
  exports.createBrowserFileFromGenericFile = createBrowserFileFromGenericFile;
  exports.createGenericFile = createGenericFile;
  exports.createGenericFileFromBrowserFile = createGenericFileFromBrowserFile;
  exports.createGenericFileFromJson = createGenericFileFromJson;
  exports.getBytesFromGenericFiles = getBytesFromGenericFiles;
  exports.isGenericFile = isGenericFile;
  exports.parseJsonFromGenericFile = parseJsonFromGenericFile;
  
  
  },{"./utils/randomStrings.cjs":99,"@metaplex-foundation/umi-serializers":48}],71:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiPublicKeys = require('@metaplex-foundation/umi-public-keys');
  var umiSerializers = require('@metaplex-foundation/umi-serializers');
  var SdkError = require('./errors/SdkError.cjs');
  
  /**
   * Builder for `getProgramAccounts` RPC requests.
   * @category Utils â€” GpaBuilder
   */
  class GpaBuilder {
    constructor(context, programId, options = {}) {
      this.context = context;
      this.programId = programId;
      this.options = options;
    }
    reset() {
      return new GpaBuilder(this.context, this.programId, {
        fields: this.options.fields,
        deserializeCallback: this.options.deserializeCallback
      });
    }
    registerFields(fields) {
      return new GpaBuilder(this.context, this.programId, {
        ...this.options,
        fields
      });
    }
    registerFieldsFromStruct(structFields) {
      let offset = 0;
      const fields = structFields.reduce((acc, [field, serializer]) => {
        acc[field] = [offset, serializer];
        offset = offset === null || serializer.fixedSize === null ? null : offset + serializer.fixedSize;
        return acc;
      }, {});
      return this.registerFields(fields);
    }
    deserializeUsing(callback) {
      return new GpaBuilder(this.context, this.programId, {
        ...this.options,
        deserializeCallback: callback
      });
    }
    slice(offset, length) {
      return new GpaBuilder(this.context, this.programId, {
        ...this.options,
        dataSlice: {
          offset,
          length
        }
      });
    }
    sliceField(field, offset) {
      const [effectiveOffset, serializer] = this.getField(field, offset);
      if (!serializer.fixedSize) {
        throw new SdkError.SdkError(`Cannot slice field [${field}] because its size is variable.`);
      }
      return this.slice(effectiveOffset, serializer.fixedSize);
    }
    withoutData() {
      return this.slice(0, 0);
    }
    addFilter(...filters) {
      return new GpaBuilder(this.context, this.programId, {
        ...this.options,
        filters: [...(this.options.filters ?? []), ...filters]
      });
    }
    where(offset, data) {
      let bytes;
      if (typeof data === 'string') {
        bytes = umiSerializers.base58.serialize(data);
      } else if (typeof data === 'number' || typeof data === 'bigint' || typeof data === 'boolean') {
        bytes = umiSerializers.base10.serialize(BigInt(data).toString());
      } else {
        bytes = new Uint8Array(data);
      }
      return this.addFilter({
        memcmp: {
          offset,
          bytes
        }
      });
    }
    whereField(field, data, offset) {
      const [effectiveOffset, serializer] = this.getField(field, offset);
      return this.where(effectiveOffset, serializer.serialize(data));
    }
    whereSize(dataSize) {
      return this.addFilter({
        dataSize
      });
    }
    sortUsing(callback) {
      return new GpaBuilder(this.context, this.programId, {
        ...this.options,
        sortCallback: callback
      });
    }
    async get(options = {}) {
      const accounts = await this.context.rpc.getProgramAccounts(this.programId, {
        ...options,
        dataSlice: options.dataSlice ?? this.options.dataSlice,
        filters: [...(options.filters ?? []), ...(this.options.filters ?? [])]
      });
      if (this.options.sortCallback) {
        accounts.sort(this.options.sortCallback);
      }
      return accounts;
    }
    async getAndMap(callback, options = {}) {
      return (await this.get(options)).map(callback);
    }
    async getDeserialized(options = {}) {
      const rpcAccounts = await this.get(options);
      if (!this.options.deserializeCallback) return rpcAccounts;
      return rpcAccounts.map(this.options.deserializeCallback);
    }
    async getPublicKeys(options = {}) {
      return this.getAndMap(account => account.publicKey, options);
    }
    async getDataAsPublicKeys(options = {}) {
      return this.getAndMap(account => {
        try {
          return umiPublicKeys.publicKey(account.data);
        } catch (error) {
          const message = `Following a getProgramAccount call, you are trying to use an ` + `account's data (or a slice of it) as a public key. ` + `However, we encountered an account ` + `[${account.publicKey}] whose data ` + `[base64=${umiSerializers.base64.deserialize(account.data)}] ` + `is not a valid public key.`;
          throw new SdkError.SdkError(message);
        }
      }, options);
    }
    getField(fieldName, forcedOffset) {
      if (!this.options.fields) {
        throw new SdkError.SdkError('Fields are not defined in this GpaBuilder.');
      }
      const field = this.options.fields[fieldName];
      if (!field) {
        throw new SdkError.SdkError(`Field [${fieldName}] is not defined in this GpaBuilder.`);
      }
      const [offset, serializer] = field;
      if (forcedOffset !== undefined) {
        return [forcedOffset, serializer];
      }
      if (offset === null) {
        throw new SdkError.SdkError(`Field [${fieldName}] does not have a fixed offset. ` + `This is likely because it is not in the fixed part of ` + `the account's data. In other words, it is located after ` + `a field of variable length which means we cannot find a ` + `fixed offset for the filter. You may go around this by ` + `providing an offset explicitly.`);
      }
      return [offset, serializer];
    }
  }
  
  /**
   * Creates a new {@link GpaBuilder} instance.
   * @category Utils â€” GpaBuilder
   */
  const gpaBuilder = (context, programId) => new GpaBuilder(context, programId);
  
  exports.GpaBuilder = GpaBuilder;
  exports.gpaBuilder = gpaBuilder;
  
  
  },{"./errors/SdkError.cjs":92,"@metaplex-foundation/umi-public-keys":8,"@metaplex-foundation/umi-serializers":48}],72:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var InterfaceImplementationMissingError = require('./errors/InterfaceImplementationMissingError.cjs');
  
  /**
   * An implementation of the {@link HttpInterface} that throws an error when called.
   * @category Http
   */
  function createNullHttp() {
    const errorHandler = () => {
      throw new InterfaceImplementationMissingError.InterfaceImplementationMissingError('HttpInterface', 'http');
    };
    return {
      send: errorHandler
    };
  }
  
  exports.createNullHttp = createNullHttp;
  
  
  },{"./errors/InterfaceImplementationMissingError.cjs":89}],73:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /** Defines a number in milliseconds. */
  
  /**
   * Defines a HTTP Request with custom data.
   * @category Http
   */
  
  /**
   * Creates a new {@link HttpRequestBuilder} instance.
   * @category Http
   */
  const request = () => new HttpRequestBuilder({
    method: 'get',
    data: undefined,
    headers: {},
    url: ''
  });
  
  /**
   * A builder for constructing {@link HttpRequest} instances.
   * @category Http
   */
  class HttpRequestBuilder {
    constructor(request) {
      this.request = request;
    }
    asJson() {
      return this.contentType('application/json');
    }
    asMultipart() {
      return this.contentType('multipart/form-data');
    }
    asForm() {
      return this.contentType('application/x-www-form-urlencoded');
    }
    accept(contentType) {
      return this.withHeader('accept', contentType);
    }
    contentType(contentType) {
      return this.withHeader('content-type', contentType);
    }
    userAgent(userAgent) {
      return this.withHeader('user-agent', userAgent);
    }
    withToken(token, type = 'Bearer') {
      return this.withHeader('authorization', `${type} ${token}`);
    }
    withHeader(key, value) {
      return this.withHeaders({
        [key]: value
      });
    }
    withHeaders(headers) {
      return new HttpRequestBuilder({
        ...this.request,
        headers: {
          ...this.request.headers,
          ...headers
        }
      });
    }
    dontFollowRedirects() {
      return this.followRedirects(0);
    }
    followRedirects(maxRedirects) {
      return new HttpRequestBuilder({
        ...this.request,
        maxRedirects
      });
    }
    withoutTimeout() {
      return this.withTimeout(0);
    }
    withTimeout(timeout) {
      return new HttpRequestBuilder({
        ...this.request,
        timeout
      });
    }
    withAbortSignal(signal) {
      return new HttpRequestBuilder({
        ...this.request,
        signal
      });
    }
    withEndpoint(method, url) {
      return new HttpRequestBuilder({
        ...this.request,
        method,
        url
      });
    }
    withParams(params) {
      const url = new URL(this.request.url);
      const newSearch = new URLSearchParams(params);
      const search = new URLSearchParams(url.searchParams);
      [...newSearch.entries()].forEach(([key, val]) => {
        search.append(key, val);
      });
      url.search = search.toString();
      return new HttpRequestBuilder({
        ...this.request,
        url: url.toString()
      });
    }
    withData(data) {
      return new HttpRequestBuilder({
        ...this.request,
        data
      });
    }
    get(url) {
      return this.withEndpoint('get', url);
    }
    post(url) {
      return this.withEndpoint('post', url);
    }
    put(url) {
      return this.withEndpoint('put', url);
    }
    patch(url) {
      return this.withEndpoint('patch', url);
    }
    delete(url) {
      return this.withEndpoint('delete', url);
    }
    get method() {
      return this.request.method;
    }
    get url() {
      return this.request.url;
    }
    get data() {
      return this.request.data;
    }
    get headers() {
      return this.request.headers;
    }
    get maxRedirects() {
      return this.request.maxRedirects;
    }
    get timeout() {
      return this.request.timeout;
    }
    get signal() {
      return this.request.signal;
    }
  }
  
  /**
   * Defines a HTTP method as a string.
   * @category Http
   */
  
  exports.HttpRequestBuilder = HttpRequestBuilder;
  exports.request = request;
  
  
  },{}],74:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var Transaction = require('./Transaction.cjs');
  
  /**
   * Represents a keypair with a public key and a secret key.
   * @category Signers and PublicKeys
   */
  
  /**
   * Generate a new random {@link KeypairSigner} using the Eddsa interface.
   * @category Signers and PublicKeys
   */
  const generateSigner = context => createSignerFromKeypair(context, context.eddsa.generateKeypair());
  
  /**
   * Creates a {@link KeypairSigner} from a {@link Keypair} object.
   * @category Signers and PublicKeys
   */
  const createSignerFromKeypair = (context, keypair) => ({
    publicKey: keypair.publicKey,
    secretKey: keypair.secretKey,
    async signMessage(message) {
      return context.eddsa.sign(message, keypair);
    },
    async signTransaction(transaction) {
      const message = transaction.serializedMessage;
      const signature = context.eddsa.sign(message, keypair);
      return Transaction.addTransactionSignature(transaction, signature, keypair.publicKey);
    },
    async signAllTransactions(transactions) {
      return Promise.all(transactions.map(transaction => this.signTransaction(transaction)));
    }
  });
  
  /**
   * Whether the given signer is a {@link KeypairSigner}.
   * @category Signers and PublicKeys
   */
  const isKeypairSigner = signer => signer.secretKey !== undefined;
  
  exports.createSignerFromKeypair = createSignerFromKeypair;
  exports.generateSigner = generateSigner;
  exports.isKeypairSigner = isKeypairSigner;
  
  
  },{"./Transaction.cjs":81}],75:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /**
   * An error that contains Program logs.
   * @category Programs
   */
  
  /**
   * An error that contains a Program error code.
   * @category Programs
   */
  
  /**
   * Whether the given value is an instance of {@link ErrorWithLogs}.
   * @category Programs
   */
  const isErrorWithLogs = error => error instanceof Error && 'logs' in error;
  
  /**
   * Defines a Solana Program that can be
   * registered in Umi's program repository.
   *
   * @category Programs
   */
  
  exports.isErrorWithLogs = isErrorWithLogs;
  
  
  },{}],76:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var InterfaceImplementationMissingError = require('./errors/InterfaceImplementationMissingError.cjs');
  
  /**
   * Defines the interface for a program repository.
   * It allows us to register and retrieve programs when needed.
   *
   * @category Context and Interfaces
   */
  
  /**
   * An implementation of the {@link ProgramRepositoryInterface} that throws an error when called.
   * @category Programs
   */
  function createNullProgramRepository() {
    const errorHandler = () => {
      throw new InterfaceImplementationMissingError.InterfaceImplementationMissingError('ProgramRepositoryInterface', 'programs');
    };
    return {
      has: errorHandler,
      get: errorHandler,
      getPublicKey: errorHandler,
      all: errorHandler,
      add: errorHandler,
      bind: errorHandler,
      unbind: errorHandler,
      clone: errorHandler,
      resolveError: errorHandler
    };
  }
  
  exports.createNullProgramRepository = createNullProgramRepository;
  
  
  },{"./errors/InterfaceImplementationMissingError.cjs":89}],77:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var InterfaceImplementationMissingError = require('./errors/InterfaceImplementationMissingError.cjs');
  
  /**
   * Defines the interface for an RPC client.
   * It allows us to interact with the Solana blockchain.
   *
   * @category Context and Interfaces
   */
  
  /**
   * An implementation of the {@link RpcInterface} that throws an error when called.
   * @category Rpc
   */
  function createNullRpc() {
    const errorHandler = () => {
      throw new InterfaceImplementationMissingError.InterfaceImplementationMissingError('RpcInterface', 'rpc');
    };
    return {
      getEndpoint: errorHandler,
      getCluster: errorHandler,
      getAccount: errorHandler,
      getAccounts: errorHandler,
      getProgramAccounts: errorHandler,
      getBlockTime: errorHandler,
      getBalance: errorHandler,
      getRent: errorHandler,
      getSlot: errorHandler,
      getLatestBlockhash: errorHandler,
      getTransaction: errorHandler,
      getSignatureStatuses: errorHandler,
      accountExists: errorHandler,
      airdrop: errorHandler,
      call: errorHandler,
      sendTransaction: errorHandler,
      confirmTransaction: errorHandler
    };
  }
  
  exports.createNullRpc = createNullRpc;
  
  
  },{"./errors/InterfaceImplementationMissingError.cjs":89}],78:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var InterfaceImplementationMissingError = require('./errors/InterfaceImplementationMissingError.cjs');
  
  /**
   * Defines the interface for a set of serializers
   * that can be used to serialize/deserialize any Serde types.
   *
   * @category Context and Interfaces
   * @deprecated This interface is deprecated.
   * You can now directly use `@metaplex-foundation/umi/serializers` instead.
   */
  
  /**
   * An implementation of the {@link SerializerInterface} that throws an error when called.
   * @category Serializers
   */
  function createNullSerializer() {
    const errorHandler = () => {
      throw new InterfaceImplementationMissingError.InterfaceImplementationMissingError('SerializerInterface', 'serializer');
    };
    return {
      tuple: errorHandler,
      array: errorHandler,
      map: errorHandler,
      set: errorHandler,
      option: errorHandler,
      nullable: errorHandler,
      struct: errorHandler,
      enum: errorHandler,
      dataEnum: errorHandler,
      string: errorHandler,
      bool: errorHandler,
      unit: errorHandler,
      u8: errorHandler,
      u16: errorHandler,
      u32: errorHandler,
      u64: errorHandler,
      u128: errorHandler,
      i8: errorHandler,
      i16: errorHandler,
      i32: errorHandler,
      i64: errorHandler,
      i128: errorHandler,
      f32: errorHandler,
      f64: errorHandler,
      bytes: errorHandler,
      publicKey: errorHandler
    };
  }
  
  exports.createNullSerializer = createNullSerializer;
  
  
  },{"./errors/InterfaceImplementationMissingError.cjs":89}],79:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var arrays = require('./utils/arrays.cjs');
  
  /**
   * Defines a public key that can sign transactions and messages.
   * @category Context and Interfaces
   */
  
  /**
   * Signs a transaction using the provided signers.
   * @category Signers and PublicKeys
   */
  const signTransaction = async (transaction, signers) => signers.reduce(async (promise, signer) => {
    const unsigned = await promise;
    return signer.signTransaction(unsigned);
  }, Promise.resolve(transaction));
  
  /**
   * Signs multiple transactions using the provided signers
   * such that signers that need to sign multiple transactions
   * sign them all at once using the `signAllTransactions` method.
   *
   * @category Signers and PublicKeys
   */
  const signAllTransactions = async transactionsWithSigners => {
    const transactions = transactionsWithSigners.map(item => item.transaction);
    const signersWithTransactions = transactionsWithSigners.reduce((all, {
      signers
    }, index) => {
      signers.forEach(signer => {
        const item = all.find(item => item.signer.publicKey === signer.publicKey);
        if (item) {
          item.indices.push(index);
        } else {
          all.push({
            signer,
            indices: [index]
          });
        }
      });
      return all;
    }, []);
    return signersWithTransactions.reduce(async (promise, {
      signer,
      indices
    }) => {
      const transactions = await promise;
      if (indices.length === 1) {
        const unsigned = transactions[indices[0]];
        transactions[indices[0]] = await signer.signTransaction(unsigned);
        return transactions;
      }
      const unsigned = indices.map(index => transactions[index]);
      const signed = await signer.signAllTransactions(unsigned);
      indices.forEach((index, position) => {
        transactions[index] = signed[position];
      });
      return transactions;
    }, Promise.resolve(transactions));
  };
  
  /**
   * Whether the provided value is a `Signer`.
   * @category Signers and PublicKeys
   */
  const isSigner = value => typeof value === 'object' && 'publicKey' in value && 'signMessage' in value;
  
  /**
   * Deduplicates the provided signers by public key.
   * @category Signers and PublicKeys
   */
  const uniqueSigners = signers => arrays.uniqueBy(signers, (a, b) => a.publicKey === b.publicKey);
  
  /**
   * Creates a `Signer` that, when required to sign, does nothing.
   * This can be useful when libraries require a `Signer` but
   * we don't have one in the current environment. For example,
   * if the transaction will then be signed in a backend server.
   *
   * @category Signers and PublicKeys
   */
  const createNoopSigner = publicKey => ({
    publicKey,
    async signMessage(message) {
      return message;
    },
    async signTransaction(transaction) {
      return transaction;
    },
    async signAllTransactions(transactions) {
      return transactions;
    }
  });
  
  /**
   * Creates a `Signer` that, when required to sign, throws an error.
   * @category Signers and PublicKeys
   */
  function createNullSigner() {
    const error = new Error('Trying to use a NullSigner. ' + 'Did you forget to set a Signer on your Umi instance? ' + 'See the `signerIdentity` method for more information.');
    const errorHandler = () => {
      throw error;
    };
    return {
      get publicKey() {
        throw error;
      },
      signMessage: errorHandler,
      signTransaction: errorHandler,
      signAllTransactions: errorHandler
    };
  }
  
  exports.createNoopSigner = createNoopSigner;
  exports.createNullSigner = createNullSigner;
  exports.isSigner = isSigner;
  exports.signAllTransactions = signAllTransactions;
  exports.signTransaction = signTransaction;
  exports.uniqueSigners = uniqueSigners;
  
  
  },{"./utils/arrays.cjs":98}],80:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var Keypair = require('./Keypair.cjs');
  
  /**
   * Umi plugin that sets the identity and the payer to the given signer.
   * @category Signers and PublicKeys
   */
  const signerIdentity = (signer, setPayer = true) => ({
    install(umi) {
      umi.identity = signer;
      if (setPayer) {
        umi.payer = signer;
      }
    }
  });
  
  /**
   * Umi plugin that only sets the payer to the given signer.
   * @category Signers and PublicKeys
   */
  const signerPayer = signer => ({
    install(umi) {
      umi.payer = signer;
    }
  });
  
  /**
   * Umi plugin that sets the identity and the payer to a randomly generated signer.
   * @category Signers and PublicKeys
   */
  const generatedSignerIdentity = (setPayer = true) => ({
    install(umi) {
      const signer = Keypair.generateSigner(umi);
      umi.use(signerIdentity(signer, setPayer));
    }
  });
  
  /**
   * Umi plugin that only sets the payer to a randomly generated signer.
   * @category Signers and PublicKeys
   */
  const generatedSignerPayer = () => ({
    install(umi) {
      const signer = Keypair.generateSigner(umi);
      umi.use(signerPayer(signer));
    }
  });
  
  /**
   * Umi plugin that sets the identity and the payer to a provided keypair.
   * @category Signers and PublicKeys
   */
  const keypairIdentity = (keypair, setPayer = true) => ({
    install(umi) {
      const signer = Keypair.createSignerFromKeypair(umi, keypair);
      umi.use(signerIdentity(signer, setPayer));
    }
  });
  
  /**
   * Umi plugin that only sets the payer to a provided keypair.
   * @category Signers and PublicKeys
   */
  const keypairPayer = keypair => ({
    install(umi) {
      const signer = Keypair.createSignerFromKeypair(umi, keypair);
      umi.use(signerPayer(signer));
    }
  });
  
  exports.generatedSignerIdentity = generatedSignerIdentity;
  exports.generatedSignerPayer = generatedSignerPayer;
  exports.keypairIdentity = keypairIdentity;
  exports.keypairPayer = keypairPayer;
  exports.signerIdentity = signerIdentity;
  exports.signerPayer = signerPayer;
  
  
  },{"./Keypair.cjs":74}],81:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /**
   * The maximum amount of bytes that can be used for a transaction.
   * @category Transactions
   */
  const TRANSACTION_SIZE_LIMIT = 1232;
  
  /**
   * The version of a transaction.
   * - Legacy is the very first iteration of Solana transactions.
   * - V0 introduces the concept of versionned transaction for
   * the first time and adds supports for address lookup tables.
   *
   * @category Transactions
   */
  
  /**
   * Adds a given signature to the transaction's signature array
   * and returns the updated transaction as a new object.
   *
   * @category Transactions
   */
  const addTransactionSignature = (transaction, signature, signerPublicKey) => {
    const maxSigners = transaction.message.header.numRequiredSignatures;
    const signerPublicKeys = transaction.message.accounts.slice(0, maxSigners);
    const signerIndex = signerPublicKeys.findIndex(key => key === signerPublicKey);
    if (signerIndex < 0) {
      throw new Error('The provided signer is not required to sign this transaction.');
    }
    const newSignatures = [...transaction.signatures];
    newSignatures[signerIndex] = signature;
    return {
      ...transaction,
      signatures: newSignatures
    };
  };
  
  exports.TRANSACTION_SIZE_LIMIT = TRANSACTION_SIZE_LIMIT;
  exports.addTransactionSignature = addTransactionSignature;
  
  
  },{}],82:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var Signer = require('./Signer.cjs');
  var Transaction = require('./Transaction.cjs');
  var SdkError = require('./errors/SdkError.cjs');
  
  /**
   * Defines an generic object with wrapped instructions,
   * such as a {@link TransactionBuilder}.
   * @category Transactions
   */
  
  /**
   * A builder that helps construct transactions.
   * @category Transactions
   */
  class TransactionBuilder {
    constructor(items = [], options = {}) {
      this.items = items;
      this.options = options;
    }
    empty() {
      return new TransactionBuilder([], this.options);
    }
    setItems(input) {
      return new TransactionBuilder(this.parseItems(input), this.options);
    }
    prepend(input) {
      return new TransactionBuilder([...this.parseItems(input), ...this.items], this.options);
    }
    append(input) {
      return new TransactionBuilder([...this.items, ...this.parseItems(input)], this.options);
    }
    add(input) {
      return this.append(input);
    }
    mapInstructions(fn) {
      return new TransactionBuilder(this.items.map(fn), this.options);
    }
    addRemainingAccounts(accountMeta, instructionIndex) {
      instructionIndex = instructionIndex ?? this.items.length - 1;
      const metas = Array.isArray(accountMeta) ? accountMeta : [accountMeta];
      const extraKeys = metas.map(meta => 'pubkey' in meta ? meta : {
        pubkey: meta.signer.publicKey,
        isSigner: true,
        isWritable: meta.isWritable
      });
      const extraSigners = metas.flatMap(meta => 'pubkey' in meta ? [] : [meta.signer]);
      return this.mapInstructions((wrappedInstruction, index) => {
        if (index !== instructionIndex) return wrappedInstruction;
        const keys = [...wrappedInstruction.instruction.keys, ...extraKeys];
        return {
          ...wrappedInstruction,
          instruction: {
            ...wrappedInstruction.instruction,
            keys
          },
          signers: [...wrappedInstruction.signers, ...extraSigners]
        };
      });
    }
    splitByIndex(index) {
      return [new TransactionBuilder(this.items.slice(0, index), this.options), new TransactionBuilder(this.items.slice(index), this.options)];
    }
  
    /**
     * Split the builder into multiple builders, such that
     * each of them should fit in a single transaction.
     *
     * This method is unsafe for several reasons:
     * - Because transactions are atomic, splitting the builder
     *   into multiple transactions may cause undesired side effects.
     *   For example, if the first transaction succeeds but the second
     *   one fails, you may end up with an inconsistent account state.
     *   This is why it is recommended to manually split your transactions
     *   such that each of them is valid on its own.
     * - It can only split the instructions of the builder. Meaning that,
     *   if the builder has a single instruction that is too big to fit in
     *   a single transaction, it will not be able to split it.
     */
    unsafeSplitByTransactionSize(context) {
      return this.items.reduce((builders, item) => {
        const lastBuilder = builders.pop();
        const lastBuilderWithItem = lastBuilder.add(item);
        if (lastBuilderWithItem.fitsInOneTransaction(context)) {
          builders.push(lastBuilderWithItem);
        } else {
          builders.push(lastBuilder);
          builders.push(lastBuilder.empty().add(item));
        }
        return builders;
      }, [this.empty()]);
    }
    setFeePayer(feePayer) {
      return new TransactionBuilder(this.items, {
        ...this.options,
        feePayer
      });
    }
    getFeePayer(context) {
      return this.options.feePayer ?? context.payer;
    }
    setVersion(version) {
      return new TransactionBuilder(this.items, {
        ...this.options,
        version
      });
    }
    useLegacyVersion() {
      return this.setVersion('legacy');
    }
    useV0() {
      return this.setVersion(0);
    }
    setAddressLookupTables(addressLookupTables) {
      return new TransactionBuilder(this.items, {
        ...this.options,
        addressLookupTables
      });
    }
    getBlockhash() {
      return typeof this.options.blockhash === 'object' ? this.options.blockhash.blockhash : this.options.blockhash;
    }
    setBlockhash(blockhash) {
      return new TransactionBuilder(this.items, {
        ...this.options,
        blockhash
      });
    }
    async setLatestBlockhash(context, options = {}) {
      return this.setBlockhash(await context.rpc.getLatestBlockhash(options));
    }
    getInstructions() {
      return this.items.map(item => item.instruction);
    }
    getSigners(context) {
      return Signer.uniqueSigners([this.getFeePayer(context), ...this.items.flatMap(item => item.signers)]);
    }
    getBytesCreatedOnChain() {
      return this.items.reduce((sum, item) => sum + item.bytesCreatedOnChain, 0);
    }
    async getRentCreatedOnChain(context) {
      return context.rpc.getRent(this.getBytesCreatedOnChain(), {
        includesHeaderBytes: true
      });
    }
    getTransactionSize(context) {
      return context.transactions.serialize(this.setBlockhash('11111111111111111111111111111111').build(context)).length;
    }
    minimumTransactionsRequired(context) {
      return Math.ceil(this.getTransactionSize(context) / Transaction.TRANSACTION_SIZE_LIMIT);
    }
    fitsInOneTransaction(context) {
      return this.minimumTransactionsRequired(context) === 1;
    }
    build(context) {
      const blockhash = this.getBlockhash();
      if (!blockhash) {
        throw new SdkError.SdkError('Setting a blockhash is required to build a transaction. ' + 'Please use the `setBlockhash` or `setLatestBlockhash` methods.');
      }
      const input = {
        version: this.options.version ?? 0,
        payer: this.getFeePayer(context).publicKey,
        instructions: this.getInstructions(),
        blockhash
      };
      if (input.version === 0 && this.options.addressLookupTables) {
        input.addressLookupTables = this.options.addressLookupTables;
      }
      return context.transactions.create(input);
    }
    async buildWithLatestBlockhash(context, options = {}) {
      let builder = this;
      if (!this.options.blockhash) {
        builder = await this.setLatestBlockhash(context, options);
      }
      return builder.build(context);
    }
    async buildAndSign(context) {
      return Signer.signTransaction(await this.buildWithLatestBlockhash(context), this.getSigners(context));
    }
    async send(context, options = {}) {
      const transaction = await this.buildAndSign(context);
      return context.rpc.sendTransaction(transaction, options);
    }
    async confirm(context, signature, options = {}) {
      let builder = this;
      if (!this.options.blockhash) {
        builder = await this.setLatestBlockhash(context);
      }
      let strategy;
      if (options.strategy) {
        strategy = options.strategy;
      } else {
        const blockhash = typeof builder.options.blockhash === 'object' ? builder.options.blockhash : await context.rpc.getLatestBlockhash();
        strategy = options.strategy ?? {
          type: 'blockhash',
          ...blockhash
        };
      }
      return context.rpc.confirmTransaction(signature, {
        ...options,
        strategy
      });
    }
    async sendAndConfirm(context, options = {}) {
      let builder = this;
      if (!this.options.blockhash) {
        builder = await this.setLatestBlockhash(context);
      }
      const signature = await builder.send(context, options.send);
      const result = await builder.confirm(context, signature, options.confirm);
      return {
        signature,
        result
      };
    }
    parseItems(input) {
      return (Array.isArray(input) ? input : [input]).flatMap(item => 'items' in item ? item.items : [item]);
    }
  }
  
  /**
   * Creates a new transaction builder.
   * @category Transactions
   */
  const transactionBuilder = (items = []) => new TransactionBuilder(items);
  
  exports.TransactionBuilder = TransactionBuilder;
  exports.transactionBuilder = transactionBuilder;
  
  
  },{"./Signer.cjs":79,"./Transaction.cjs":81,"./errors/SdkError.cjs":92}],83:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var Signer = require('./Signer.cjs');
  var TransactionBuilder = require('./TransactionBuilder.cjs');
  var arrays = require('./utils/arrays.cjs');
  
  class TransactionBuilderGroup {
    constructor(builders = [], options = {}) {
      this.builders = builders;
      this.options = options;
    }
    prepend(builder) {
      const newBuilders = Array.isArray(builder) ? builder : [builder];
      return new TransactionBuilderGroup([...newBuilders, ...this.builders], this.options);
    }
    append(builder) {
      const newBuilders = Array.isArray(builder) ? builder : [builder];
      return new TransactionBuilderGroup([...newBuilders, ...this.builders], this.options);
    }
    add(builder) {
      return this.append(builder);
    }
    sequential() {
      return new TransactionBuilderGroup(this.builders, {
        ...this.options,
        parallel: false
      });
    }
    parallel() {
      return new TransactionBuilderGroup(this.builders, {
        ...this.options,
        parallel: true
      });
    }
    isParallel() {
      return this.options.parallel ?? false;
    }
    merge() {
      if (this.builders.length === 0) {
        return new TransactionBuilder.TransactionBuilder();
      }
      return this.builders.reduce((builder, next) => builder.add(next), this.builders[0].empty());
    }
    build(context) {
      return this.builders.map(builder => builder.build(context));
    }
    async setLatestBlockhash(context) {
      const hasBlockhashlessBuilder = this.builders.some(builder => !builder.options.blockhash);
      if (!hasBlockhashlessBuilder) return this;
      const blockhash = await context.rpc.getLatestBlockhash();
      return this.map(builder => builder.options.blockhash ? builder : builder.setBlockhash(blockhash));
    }
    async buildWithLatestBlockhash(context) {
      return (await this.setLatestBlockhash(context)).build(context);
    }
    async buildAndSign(context) {
      const transactions = await this.buildWithLatestBlockhash(context);
      const signers = this.builders.map(builder => builder.getSigners(context));
      return Signer.signAllTransactions(arrays.zipMap(transactions, signers, (transaction, txSigners) => ({
        transaction,
        signers: txSigners ?? []
      })));
    }
    async send(context, options = {}) {
      return this.runAll(await this.buildAndSign(context), async tx => context.rpc.sendTransaction(tx, options));
    }
    async sendAndConfirm(context, options = {}) {
      const blockhashWithExpiryBlockHeight = this.builders.find(builder => typeof builder.options.blockhash === 'object')?.options.blockhash;
      let strategy;
      if (options.confirm?.strategy) {
        strategy = options.confirm.strategy;
      } else {
        const blockhash = blockhashWithExpiryBlockHeight ?? (await context.rpc.getLatestBlockhash());
        strategy = options.confirm?.strategy ?? {
          type: 'blockhash',
          ...blockhash
        };
      }
      return this.runAll(await this.buildAndSign(context), async tx => {
        const signature = await context.rpc.sendTransaction(tx, options.send);
        const result = await context.rpc.confirmTransaction(signature, {
          ...options.confirm,
          strategy
        });
        return {
          signature,
          result
        };
      });
    }
    map(fn) {
      return new TransactionBuilderGroup(this.builders.map(fn));
    }
    filter(fn) {
      return new TransactionBuilderGroup(this.builders.filter(fn));
    }
    async runAll(array, fn) {
      if (this.isParallel()) {
        return Promise.all(array.map(fn));
      }
      return array.reduce(async (promise, ...args) => [...(await promise), await fn(...args)], Promise.resolve([]));
    }
  }
  function transactionBuilderGroup(builders = []) {
    return new TransactionBuilderGroup(builders);
  }
  
  exports.TransactionBuilderGroup = TransactionBuilderGroup;
  exports.transactionBuilderGroup = transactionBuilderGroup;
  
  
  },{"./Signer.cjs":79,"./TransactionBuilder.cjs":82,"./utils/arrays.cjs":98}],84:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var InterfaceImplementationMissingError = require('./errors/InterfaceImplementationMissingError.cjs');
  
  /**
   * An implementation of the {@link TransactionFactoryInterface} that throws an error when called.
   * @category Transactions
   */
  function createNullTransactionFactory() {
    const errorHandler = () => {
      throw new InterfaceImplementationMissingError.InterfaceImplementationMissingError('TransactionFactoryInterface', 'transactions');
    };
    return {
      create: errorHandler,
      serialize: errorHandler,
      deserialize: errorHandler,
      serializeMessage: errorHandler,
      deserializeMessage: errorHandler
    };
  }
  
  exports.createNullTransactionFactory = createNullTransactionFactory;
  
  
  },{"./errors/InterfaceImplementationMissingError.cjs":89}],85:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var Context = require('./Context.cjs');
  
  /**
   * Creates a Umi instance using only Null implementations of the interfaces.
   * The `use` method can then be used to install plugins and replace the
   * Null implementations with real implementations.
   *
   * @category Context and Interfaces
   */
  const createUmi = () => ({
    ...Context.createNullContext(),
    use(plugin) {
      plugin.install(this);
      return this;
    }
  });
  
  exports.createUmi = createUmi;
  
  
  },{"./Context.cjs":66}],86:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var InterfaceImplementationMissingError = require('./errors/InterfaceImplementationMissingError.cjs');
  
  /**
   * An implementation of the {@link UploaderInterface} that throws an error when called.
   * @category Storage
   */
  function createNullUploader() {
    const errorHandler = () => {
      throw new InterfaceImplementationMissingError.InterfaceImplementationMissingError('UploaderInterface', 'uploader');
    };
    return {
      upload: errorHandler,
      uploadJson: errorHandler,
      getUploadPrice: errorHandler
    };
  }
  
  exports.createNullUploader = createNullUploader;
  
  
  },{"./errors/InterfaceImplementationMissingError.cjs":89}],87:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var SdkError = require('./SdkError.cjs');
  
  /** @category Errors */
  class AccountNotFoundError extends SdkError.SdkError {
    name = 'AccountNotFoundError';
    constructor(publicKey, accountType, solution) {
      const message = `${accountType ? `The account of type [${accountType}] was not found` : 'No account was found'} at the provided address [${publicKey}].${solution ? ` ${solution}` : ''}`;
      super(message);
    }
  }
  
  exports.AccountNotFoundError = AccountNotFoundError;
  
  
  },{"./SdkError.cjs":92}],88:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var SdkError = require('./SdkError.cjs');
  
  /** @category Errors */
  class AmountMismatchError extends SdkError.SdkError {
    name = 'AmountMismatchError';
    constructor(left, right, operation) {
      const wrappedOperation = operation ? ` [${operation}]` : '';
      const message = `The SDK tried to execute an operation${wrappedOperation} on two amounts of different types: ` + `[${left.identifier} with ${left.decimals} decimals] and ` + `[${right.identifier} with ${right.decimals} decimals]. ` + `Provide both amounts in the same type to perform this operation.`;
      super(message);
      this.left = left;
      this.right = right;
      this.operation = operation;
    }
  }
  
  exports.AmountMismatchError = AmountMismatchError;
  
  
  },{"./SdkError.cjs":92}],89:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var SdkError = require('./SdkError.cjs');
  
  /** @category Errors */
  class InterfaceImplementationMissingError extends SdkError.SdkError {
    name = 'InterfaceImplementationMissingError';
    constructor(interfaceName, contextVariable) {
      const interfaceBasename = interfaceName.replace(/Interface$/, '');
      const message = `Tried using ${interfaceName} but no implementation of that interface was found. ` + `Make sure an implementation is registered, ` + `e.g. via "context.${contextVariable} = new My${interfaceBasename}();".`;
      super(message);
    }
  }
  
  exports.InterfaceImplementationMissingError = InterfaceImplementationMissingError;
  
  
  },{"./SdkError.cjs":92}],90:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var SdkError = require('./SdkError.cjs');
  
  /** @category Errors */
  class InvalidBaseStringError extends SdkError.SdkError {
    name = 'InvalidBaseStringError';
    constructor(value, base, cause) {
      const message = `Expected a string of base ${base}, got [${value}].`;
      super(message, cause);
    }
  }
  
  exports.InvalidBaseStringError = InvalidBaseStringError;
  
  
  },{"./SdkError.cjs":92}],91:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var UmiError = require('./UmiError.cjs');
  
  /** @category Errors */
  
  /** @category Errors */
  class ProgramError extends UmiError.UmiError {
    name = 'ProgramError';
    constructor(message, program, cause) {
      super(message, 'program', `${program.name} [${program.publicKey}]`, cause);
      this.program = program;
      this.logs = cause?.logs;
      if (this.logs) {
        this.message += `\nProgram Logs:\n${this.logs.map(log => `| ${log}`).join('\n')}\n`;
      }
    }
  }
  
  exports.ProgramError = ProgramError;
  
  
  },{"./UmiError.cjs":93}],92:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var UmiError = require('./UmiError.cjs');
  
  /** @category Errors */
  class SdkError extends UmiError.UmiError {
    name = 'SdkError';
    constructor(message, cause) {
      super(message, 'sdk', undefined, cause);
    }
  }
  
  exports.SdkError = SdkError;
  
  
  },{"./UmiError.cjs":93}],93:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /** @category Errors */
  class UmiError extends Error {
    name = 'UmiError';
    constructor(message, source, sourceDetails, cause) {
      super(message);
      this.source = source;
      this.sourceDetails = sourceDetails;
      this.cause = cause;
      this.message = `${this.message}\n\nSource: ${this.getFullSource()}${this.cause ? `\n\nCaused By: ${this.cause}` : ''}\n`;
    }
    getCapitalizedSource() {
      if (this.source === 'sdk' || this.source === 'rpc') {
        return this.source.toUpperCase();
      }
      return this.source[0].toUpperCase() + this.source.slice(1);
    }
    getFullSource() {
      const capitalizedSource = this.getCapitalizedSource();
      const sourceDetails = this.sourceDetails ? ` > ${this.sourceDetails}` : '';
      return capitalizedSource + sourceDetails;
    }
    toString() {
      return `[${this.name}] ${this.message}`;
    }
  }
  
  /** @category Errors */
  
  exports.UmiError = UmiError;
  
  
  },{}],94:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var SdkError = require('./SdkError.cjs');
  
  /** @category Errors */
  class UnexpectedAccountError extends SdkError.SdkError {
    name = 'UnexpectedAccountError';
    constructor(publicKey, expectedType, cause) {
      const message = `The account at the provided address [${publicKey}] ` + `is not of the expected type [${expectedType}].`;
      super(message, cause);
    }
  }
  
  exports.UnexpectedAccountError = UnexpectedAccountError;
  
  
  },{"./SdkError.cjs":92}],95:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var SdkError = require('./SdkError.cjs');
  
  /** @category Errors */
  class UnexpectedAmountError extends SdkError.SdkError {
    name = 'UnexpectedAmountError';
    constructor(amount, expectedIdentifier, expectedDecimals) {
      const message = `Expected amount of type [${expectedIdentifier} with ${expectedDecimals} decimals] ` + `but got [${amount.identifier} with ${amount.decimals} decimals]. ` + `Ensure the provided Amount is of the expected type.`;
      super(message);
      this.amount = amount;
      this.expectedIdentifier = expectedIdentifier;
      this.expectedDecimals = expectedDecimals;
    }
  }
  
  exports.UnexpectedAmountError = UnexpectedAmountError;
  
  
  },{"./SdkError.cjs":92}],96:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiOptions = require('@metaplex-foundation/umi-options');
  var umiPublicKeys = require('@metaplex-foundation/umi-public-keys');
  var serializersInternal = require('./serializersInternal.cjs');
  var Account = require('./Account.cjs');
  var Amount = require('./Amount.cjs');
  var BigInt = require('./BigInt.cjs');
  var Cluster = require('./Cluster.cjs');
  var Context = require('./Context.cjs');
  var DateTime = require('./DateTime.cjs');
  var DownloaderInterface = require('./DownloaderInterface.cjs');
  var EddsaInterface = require('./EddsaInterface.cjs');
  var GenericFile = require('./GenericFile.cjs');
  var GpaBuilder = require('./GpaBuilder.cjs');
  var HttpInterface = require('./HttpInterface.cjs');
  var HttpRequest = require('./HttpRequest.cjs');
  var Keypair = require('./Keypair.cjs');
  var Program = require('./Program.cjs');
  var ProgramRepositoryInterface = require('./ProgramRepositoryInterface.cjs');
  var RpcInterface = require('./RpcInterface.cjs');
  var SerializerInterface = require('./SerializerInterface.cjs');
  var Signer = require('./Signer.cjs');
  var SignerPlugins = require('./SignerPlugins.cjs');
  var Transaction = require('./Transaction.cjs');
  var TransactionBuilder = require('./TransactionBuilder.cjs');
  var TransactionBuilderGroup = require('./TransactionBuilderGroup.cjs');
  var TransactionFactoryInterface = require('./TransactionFactoryInterface.cjs');
  var Umi = require('./Umi.cjs');
  var UploaderInterface = require('./UploaderInterface.cjs');
  var AccountNotFoundError = require('./errors/AccountNotFoundError.cjs');
  var AmountMismatchError = require('./errors/AmountMismatchError.cjs');
  var InterfaceImplementationMissingError = require('./errors/InterfaceImplementationMissingError.cjs');
  var InvalidBaseStringError = require('./errors/InvalidBaseStringError.cjs');
  var ProgramError = require('./errors/ProgramError.cjs');
  var SdkError = require('./errors/SdkError.cjs');
  var UmiError = require('./errors/UmiError.cjs');
  var UnexpectedAccountError = require('./errors/UnexpectedAccountError.cjs');
  var UnexpectedAmountError = require('./errors/UnexpectedAmountError.cjs');
  var arrays = require('./utils/arrays.cjs');
  var randomStrings = require('./utils/randomStrings.cjs');
  
  
  
  exports.Endian = serializersInternal.Endian;
  exports.base10 = serializersInternal.base10;
  exports.base16 = serializersInternal.base16;
  exports.base58 = serializersInternal.base58;
  exports.base64 = serializersInternal.base64;
  exports.baseX = serializersInternal.baseX;
  exports.bitArray = serializersInternal.bitArray;
  exports.fixBytes = serializersInternal.fixBytes;
  exports.fixSerializer = serializersInternal.fixSerializer;
  exports.mapSerializer = serializersInternal.mapSerializer;
  exports.mergeBytes = serializersInternal.mergeBytes;
  exports.padBytes = serializersInternal.padBytes;
  exports.padNullCharacters = serializersInternal.padNullCharacters;
  exports.removeNullCharacters = serializersInternal.removeNullCharacters;
  exports.reverseSerializer = serializersInternal.reverseSerializer;
  exports.utf8 = serializersInternal.utf8;
  exports.ACCOUNT_HEADER_SIZE = Account.ACCOUNT_HEADER_SIZE;
  exports.assertAccountExists = Account.assertAccountExists;
  exports.deserializeAccount = Account.deserializeAccount;
  exports.absoluteAmount = Amount.absoluteAmount;
  exports.addAmounts = Amount.addAmounts;
  exports.amountToNumber = Amount.amountToNumber;
  exports.amountToString = Amount.amountToString;
  exports.assertAmount = Amount.assertAmount;
  exports.assertSameAmounts = Amount.assertSameAmounts;
  exports.assertSolAmount = Amount.assertSolAmount;
  exports.compareAmounts = Amount.compareAmounts;
  exports.createAmount = Amount.createAmount;
  exports.createAmountFromDecimals = Amount.createAmountFromDecimals;
  exports.displayAmount = Amount.displayAmount;
  exports.divideAmount = Amount.divideAmount;
  exports.isAmount = Amount.isAmount;
  exports.isEqualToAmount = Amount.isEqualToAmount;
  exports.isGreaterThanAmount = Amount.isGreaterThanAmount;
  exports.isGreaterThanOrEqualToAmount = Amount.isGreaterThanOrEqualToAmount;
  exports.isLessThanAmount = Amount.isLessThanAmount;
  exports.isLessThanOrEqualToAmount = Amount.isLessThanOrEqualToAmount;
  exports.isNegativeAmount = Amount.isNegativeAmount;
  exports.isPositiveAmount = Amount.isPositiveAmount;
  exports.isSolAmount = Amount.isSolAmount;
  exports.isZeroAmount = Amount.isZeroAmount;
  exports.lamports = Amount.lamports;
  exports.mapAmountSerializer = Amount.mapAmountSerializer;
  exports.multiplyAmount = Amount.multiplyAmount;
  exports.percentAmount = Amount.percentAmount;
  exports.sameAmounts = Amount.sameAmounts;
  exports.sol = Amount.sol;
  exports.subtractAmounts = Amount.subtractAmounts;
  exports.tokenAmount = Amount.tokenAmount;
  exports.usd = Amount.usd;
  exports.createBigInt = BigInt.createBigInt;
  exports.resolveClusterFromEndpoint = Cluster.resolveClusterFromEndpoint;
  exports.createNullContext = Context.createNullContext;
  exports.dateTime = DateTime.dateTime;
  exports.formatDateTime = DateTime.formatDateTime;
  exports.mapDateTimeSerializer = DateTime.mapDateTimeSerializer;
  exports.now = DateTime.now;
  exports.createNullDownloader = DownloaderInterface.createNullDownloader;
  exports.createNullEddsa = EddsaInterface.createNullEddsa;
  exports.createBrowserFileFromGenericFile = GenericFile.createBrowserFileFromGenericFile;
  exports.createGenericFile = GenericFile.createGenericFile;
  exports.createGenericFileFromBrowserFile = GenericFile.createGenericFileFromBrowserFile;
  exports.createGenericFileFromJson = GenericFile.createGenericFileFromJson;
  exports.getBytesFromGenericFiles = GenericFile.getBytesFromGenericFiles;
  exports.isGenericFile = GenericFile.isGenericFile;
  exports.parseJsonFromGenericFile = GenericFile.parseJsonFromGenericFile;
  exports.GpaBuilder = GpaBuilder.GpaBuilder;
  exports.gpaBuilder = GpaBuilder.gpaBuilder;
  exports.createNullHttp = HttpInterface.createNullHttp;
  exports.HttpRequestBuilder = HttpRequest.HttpRequestBuilder;
  exports.request = HttpRequest.request;
  exports.createSignerFromKeypair = Keypair.createSignerFromKeypair;
  exports.generateSigner = Keypair.generateSigner;
  exports.isKeypairSigner = Keypair.isKeypairSigner;
  exports.isErrorWithLogs = Program.isErrorWithLogs;
  exports.createNullProgramRepository = ProgramRepositoryInterface.createNullProgramRepository;
  exports.createNullRpc = RpcInterface.createNullRpc;
  exports.createNullSerializer = SerializerInterface.createNullSerializer;
  exports.createNoopSigner = Signer.createNoopSigner;
  exports.createNullSigner = Signer.createNullSigner;
  exports.isSigner = Signer.isSigner;
  exports.signAllTransactions = Signer.signAllTransactions;
  exports.signTransaction = Signer.signTransaction;
  exports.uniqueSigners = Signer.uniqueSigners;
  exports.generatedSignerIdentity = SignerPlugins.generatedSignerIdentity;
  exports.generatedSignerPayer = SignerPlugins.generatedSignerPayer;
  exports.keypairIdentity = SignerPlugins.keypairIdentity;
  exports.keypairPayer = SignerPlugins.keypairPayer;
  exports.signerIdentity = SignerPlugins.signerIdentity;
  exports.signerPayer = SignerPlugins.signerPayer;
  exports.TRANSACTION_SIZE_LIMIT = Transaction.TRANSACTION_SIZE_LIMIT;
  exports.addTransactionSignature = Transaction.addTransactionSignature;
  exports.TransactionBuilder = TransactionBuilder.TransactionBuilder;
  exports.transactionBuilder = TransactionBuilder.transactionBuilder;
  exports.TransactionBuilderGroup = TransactionBuilderGroup.TransactionBuilderGroup;
  exports.transactionBuilderGroup = TransactionBuilderGroup.transactionBuilderGroup;
  exports.createNullTransactionFactory = TransactionFactoryInterface.createNullTransactionFactory;
  exports.createUmi = Umi.createUmi;
  exports.createNullUploader = UploaderInterface.createNullUploader;
  exports.AccountNotFoundError = AccountNotFoundError.AccountNotFoundError;
  exports.AmountMismatchError = AmountMismatchError.AmountMismatchError;
  exports.InterfaceImplementationMissingError = InterfaceImplementationMissingError.InterfaceImplementationMissingError;
  exports.InvalidBaseStringError = InvalidBaseStringError.InvalidBaseStringError;
  exports.ProgramError = ProgramError.ProgramError;
  exports.SdkError = SdkError.SdkError;
  exports.UmiError = UmiError.UmiError;
  exports.UnexpectedAccountError = UnexpectedAccountError.UnexpectedAccountError;
  exports.UnexpectedAmountError = UnexpectedAmountError.UnexpectedAmountError;
  exports.chunk = arrays.chunk;
  exports.uniqueBy = arrays.uniqueBy;
  exports.zipMap = arrays.zipMap;
  exports.generateRandomString = randomStrings.generateRandomString;
  Object.keys(umiOptions).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () { return umiOptions[k]; }
    });
  });
  Object.keys(umiPublicKeys).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () { return umiPublicKeys[k]; }
    });
  });
  
  
  },{"./Account.cjs":62,"./Amount.cjs":63,"./BigInt.cjs":64,"./Cluster.cjs":65,"./Context.cjs":66,"./DateTime.cjs":67,"./DownloaderInterface.cjs":68,"./EddsaInterface.cjs":69,"./GenericFile.cjs":70,"./GpaBuilder.cjs":71,"./HttpInterface.cjs":72,"./HttpRequest.cjs":73,"./Keypair.cjs":74,"./Program.cjs":75,"./ProgramRepositoryInterface.cjs":76,"./RpcInterface.cjs":77,"./SerializerInterface.cjs":78,"./Signer.cjs":79,"./SignerPlugins.cjs":80,"./Transaction.cjs":81,"./TransactionBuilder.cjs":82,"./TransactionBuilderGroup.cjs":83,"./TransactionFactoryInterface.cjs":84,"./Umi.cjs":85,"./UploaderInterface.cjs":86,"./errors/AccountNotFoundError.cjs":87,"./errors/AmountMismatchError.cjs":88,"./errors/InterfaceImplementationMissingError.cjs":89,"./errors/InvalidBaseStringError.cjs":90,"./errors/ProgramError.cjs":91,"./errors/SdkError.cjs":92,"./errors/UmiError.cjs":93,"./errors/UnexpectedAccountError.cjs":94,"./errors/UnexpectedAmountError.cjs":95,"./serializersInternal.cjs":97,"./utils/arrays.cjs":98,"./utils/randomStrings.cjs":99,"@metaplex-foundation/umi-options":3,"@metaplex-foundation/umi-public-keys":8}],97:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  var umiSerializers = require('@metaplex-foundation/umi-serializers');
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const mapSerializer = umiSerializers.mapSerializer;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const fixSerializer = umiSerializers.fixSerializer;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const reverseSerializer = umiSerializers.reverseSerializer;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const mergeBytes = umiSerializers.mergeBytes;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const padBytes = umiSerializers.padBytes;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const fixBytes = umiSerializers.fixBytes;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const utf8 = umiSerializers.utf8;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const baseX = umiSerializers.baseX;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const base10 = umiSerializers.base10;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const base58 = umiSerializers.base58;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const base64 = umiSerializers.base64;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const base16 = umiSerializers.base16;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const bitArray = umiSerializers.bitArray;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const removeNullCharacters = umiSerializers.removeNullCharacters;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const padNullCharacters = umiSerializers.padNullCharacters;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  const Endian = umiSerializers.Endian;
  
  /** @deprecated import from "@metaplex-foundation/umi/serializers" instead. */
  
  exports.Endian = Endian;
  exports.base10 = base10;
  exports.base16 = base16;
  exports.base58 = base58;
  exports.base64 = base64;
  exports.baseX = baseX;
  exports.bitArray = bitArray;
  exports.fixBytes = fixBytes;
  exports.fixSerializer = fixSerializer;
  exports.mapSerializer = mapSerializer;
  exports.mergeBytes = mergeBytes;
  exports.padBytes = padBytes;
  exports.padNullCharacters = padNullCharacters;
  exports.removeNullCharacters = removeNullCharacters;
  exports.reverseSerializer = reverseSerializer;
  exports.utf8 = utf8;
  
  
  },{"@metaplex-foundation/umi-serializers":48}],98:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /**
   * Chunks an array into smaller arrays of (at most) the specified size.
   * @category Utils
   */
  const chunk = (array, chunkSize) => array.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = [];
    }
    chunks[chunkIndex].push(item);
    return chunks;
  }, []);
  
  /**
   * Zips two arrays together, using the provided function to map the values.
   * @category Utils
   */
  const zipMap = (left, right, fn) => left.map((t, index) => fn(t, right?.[index] ?? null, index));
  
  /**
   * Deduplicates an array by the provided function.
   * @category Utils
   */
  const uniqueBy = (array, fn) => array.reduce((acc, v) => {
    if (!acc.some(x => fn(v, x))) acc.push(v);
    return acc;
  }, []);
  
  exports.chunk = chunk;
  exports.uniqueBy = uniqueBy;
  exports.zipMap = zipMap;
  
  
  },{}],99:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  /**
   * Generate a random string of the given length.
   * Warning: This is not a cryptographically secure random string generator.
   * @category Utils
   */
  const generateRandomString = (length = 20, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = '';
    const alphabetLength = alphabet.length;
    for (let i = 0; i < length; i += 1) {
      result += alphabet.charAt(Math.floor(Math.random() * alphabetLength));
    }
    return result;
  };
  
  exports.generateRandomString = generateRandomString;
  
  
  },{}]},{},[1]);