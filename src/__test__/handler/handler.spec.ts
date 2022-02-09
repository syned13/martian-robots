import { execute } from "../../handler/handler";

describe("Martian Robots", () => {
  describe("execute function", () => {
    let consoleLogMock: any;

    beforeEach(() => {
      consoleLogMock = jest.spyOn(global.console, "log").mockImplementation();
    });

    afterEach(() => {
      consoleLogMock.mockRestore();
    });

    it("should execute without errors and return expectedInput", async () => {
      const inputContent = [
        "5 3",
        "1 1 E",
        "RFRFRFRF",
        "3 2 N",
        "FRRFLLFFRRFLL",
        "0 3 W",
        "LLFFFLFLFL",
      ];

      await execute(inputContent);

      expect(console.log).toHaveBeenCalledWith("1 1 E");
      expect(console.log).toHaveBeenCalledWith("3 3 N LOST");
      expect(console.log).toHaveBeenCalledWith("2 3 S");
    });

    it("should throw error when no content is provideed", async () => {
      const inputContent: string[] = [""];

      await expect(execute(inputContent)).rejects.toThrowError(
        "invalid input: at least 3 lines required"
      );
    });

    it("should throw error when no robot positions are provideed", async () => {
      const inputContent: string[] = ["5 3"];

      await expect(execute(inputContent)).rejects.toThrowError(
        "invalid input: at least 3 lines required"
      );
    });

    it("should throw error when no robot instructions are provided", async () => {
      const inputContent: string[] = ["5 3", "1 1 E"];

      await expect(execute(inputContent)).rejects.toThrowError(
        "invalid input: at least 3 lines required"
      );
    });

    it("should throw error when invalid robot positions are provided", async () => {
      const inputContent: string[] = ["5 3", "1 1 m", "F"];

      await expect(execute(inputContent)).rejects.toThrowError(
        "invalid input: robot direction"
      );
    });

    it("should throw error when invalid robot instructions are provided", async () => {
      const inputContent: string[] = ["5 3", "1 1 E", "w"];

      await expect(execute(inputContent)).rejects.toThrowError(
        "invalid input: robot instruction"
      );
    });
  });
});
