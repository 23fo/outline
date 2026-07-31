import { vi } from "vitest";
import env from "../../env";
import Diagrams from "./Diagrams";
import FileHelper from "../lib/FileHelper";
import type { DiagramsNetClient } from "../lib/DiagramsNetClient";

const originalBasePath = env.BASE_PATH;

afterEach(() => {
  vi.restoreAllMocks();
  env.BASE_PATH = originalBasePath;
});

describe("Diagrams", () => {
  it("resolves a root-relative diagram source before loading it", async () => {
    env.BASE_PATH = "/outline";
    const urlToBase64 = vi
      .spyOn(FileHelper, "urlToBase64")
      .mockResolvedValue("data:image/svg+xml;base64,diagram");
    const client = {
      format: "xmlsvg",
      loadDiagram: vi.fn(),
    } as unknown as DiagramsNetClient;
    const extension = new Diagrams();

    await (
      extension as unknown as {
        onDiagramReady: (
          diagramClient: DiagramsNetClient,
          sourceUrl: string,
          session: { nodeSrc: string; format: "xmlsvg" | "xmlpng" }
        ) => Promise<void>;
      }
    ).onDiagramReady(client, "/api/attachments.redirect?id=diagram", {
      nodeSrc: "/api/attachments.redirect?id=diagram",
      format: "xmlsvg",
    });

    expect(urlToBase64).toHaveBeenCalledWith(
      "/outline/api/attachments.redirect?id=diagram"
    );
    expect(client.loadDiagram).toHaveBeenCalledWith(
      "data:image/svg+xml;base64,diagram"
    );
  });
});
