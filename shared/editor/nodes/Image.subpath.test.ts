// @vitest-environment jsdom

import { Schema } from "prosemirror-model";
import { vi } from "vitest";
import env from "../../env";
import Image, { downloadImageNode } from "./Image";

const originalBasePath = env?.BASE_PATH;

afterEach(() => {
  if (env) {
    env.BASE_PATH = originalBasePath;
  }
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

(env ? describe : describe.skip)("Image subpath handling", () => {
  it("resolves a root-relative image before downloading", async () => {
    env.BASE_PATH = "/outline";
    const fetch = vi.fn().mockResolvedValue({
      blob: vi.fn().mockResolvedValue(
        new Blob(["image"], {
          type: "image/png",
        })
      ),
    });
    vi.stubGlobal("fetch", fetch);
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn().mockReturnValue("blob:image"),
    });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
      () => undefined
    );

    await downloadImageNode({
      attrs: {
        src: "/api/attachments.redirect?id=image",
        alt: "image",
      },
    } as never);

    expect(fetch).toHaveBeenCalledWith(
      "/outline/api/attachments.redirect?id=image",
      { cache: undefined }
    );
  });

  it("resolves root-relative image links in static DOM output", () => {
    env.BASE_PATH = "/outline";
    const extension = new Image();
    const schema = new Schema({
      nodes: {
        doc: { content: "image*" },
        image: extension.schema,
        text: { group: "inline" },
      },
    });
    const node = schema.node("image", {
      src: "/api/attachments.redirect?id=image",
      marks: [{ type: "link", attrs: { href: "/doc/example" } }],
    });

    const dom = extension.schema.toDOM?.(node) as [
      string,
      Record<string, unknown>,
      [string, { href: string }]
    ];

    expect(dom[2][1].href).toBe("/outline/doc/example");
  });
});
