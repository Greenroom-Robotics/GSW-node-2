import {
  withGsw,
} from "../source";

test("Calling wasm methods", async () => {
  await withGsw((gswModule) => {
    const teosBase = new gswModule.TeosBase();
    console.log(teosBase)
    const p = 10
    const lat = 4
    const expectedResult = -0.099445834469453 * 1.0e+002
    const result = teosBase.gsw_z_from_p(p, lat, 0, 0)
    expect(result).toBeCloseTo(expectedResult) 
  });
});
