import { describe, expect, it } from 'vitest';
import { defineCustom } from './config';

describe('defineCustom', () => {
  // Test Case 1: 验证函数是否原样返回输入值
  it('should return the input value unchanged', () => {
    const inputString = 'test string';
    const resultString = defineCustom(inputString);
    expect(resultString).toBe(inputString);

    const inputNumber = 123;
    const resultNumber = defineCustom(inputNumber);
    expect(resultNumber).toBe(inputNumber);

    const inputObject = { a: 1, b: 'test' };
    const resultObject = defineCustom(inputObject);
    // 对于对象，toBe 检查引用是否相同，toEqual 检查值是否相同
    expect(resultObject).toBe(inputObject); // 验证返回的是同一个对象引用
    expect(resultObject).toEqual(inputObject); // 验证对象内容也相同

    const inputBoolean = true;
    const resultBoolean = defineCustom(inputBoolean);
    expect(resultBoolean).toBe(inputBoolean);
  });

  // Test Case 2: 验证泛型类型推断 (这是在 TypeScript 编译时发生的，运行时测试无法直接验证推断本身)
  // 我们通过创建不同类型的输入，来确保函数能够处理各种类型
  it('should correctly handle different input types (demonstrating type flexibility)', () => {
    // 使用对象字面量，TS 会推断出 T 的具体类型
    const myConfig = defineCustom({
      apiUrl: 'https://api.example.com',
      timeout: 5000,
      enabled: true,
      features: ['featureA', 'featureB']
    });

    // 虽然运行时测试只验证值，但这在使用 TS 时会得到 myConfig 的精确类型提示
    expect(myConfig.apiUrl).toBe('https://api.example.com');
    expect(myConfig.timeout).toBe(5000);
    expect(myConfig.enabled).toBe(true);
    expect(myConfig.features).toEqual(['featureA', 'featureB']);

    // 使用数组作为输入
    const myArrayConfig = defineCustom([1, 'hello', true]);
    expect(myArrayConfig).toEqual([1, 'hello', true]);

    // 使用 null 或 undefined (如果 T 可以是这些类型)
    const nullConfig = defineCustom(null);
    expect(nullConfig).toBeNull();

    const undefinedConfig = defineCustom(undefined);
    expect(undefinedConfig).toBeUndefined();
  });

  // Test Case 3: 模拟类型检查场景 (在运行时测试中难以完全模拟，但这才是 defineCustom 的主要价值)
  // 这个测试更多是概念性的，说明 defineCustom 如何帮助类型检查
  it('should provide type safety when used with specific types (conceptual test for TS behavior)', () => {
    // 假设我们有一个预期的配置类型
    interface SimpleConfig {
      name: string;
      version: number;
      enabled?: boolean; // 可选属性
    }

    // 使用 defineCustom 并提供类型参数 (可选，TS 通常可以推断)
    const validConfig: SimpleConfig = defineCustom<SimpleConfig>({
      name: 'My App',
      version: 1.0,
      enabled: true
    });

    // 不提供可选属性也是合法的
    const validConfigWithoutOptional: SimpleConfig = defineCustom({
      name: 'My App',
      version: 1.0
    });

    // --- 以下是类型错误场景，TS 会在编译时报错，但运行时不会 ---
    // // @ts-expect-error - 故意制造类型错误以验证 TS 检查
    // const invalidConfigMissingProperty = defineCustom<SimpleConfig>({
    //    version: 1.0, // 缺少 name 属性
    //    enabled: false
    // });

    // // @ts-expect-error - 故意制造类型错误
    // const invalidConfigWrongType = defineCustom<SimpleConfig>({
    //    name: 'My App',
    //    version: '1.0', // version 类型错误
    //    enabled: false
    // });

    // // @ts-expect-error - 故意制造类型错误
    // const invalidConfigExtraProperty = defineCustom<SimpleConfig>({
    //    name: 'My App',
    //    version: 1.0,
    //    extraField: 'oops' // 多余的属性
    // });

    // 在运行时测试中，我们只能验证 validConfig 的值是否正确
    expect(validConfig.name).toBe('My App');
    expect(validConfig.version).toBe(1.0);
    expect(validConfig.enabled).toBe(true);

    expect(validConfigWithoutOptional.name).toBe('My App');
    expect(validConfigWithoutOptional.version).toBe(1.0);
    expect(validConfigWithoutOptional.enabled).toBeUndefined(); // 验证可选属性确实是 undefined
  });
});
