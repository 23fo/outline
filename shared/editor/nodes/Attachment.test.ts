// @vitest-environment jsdom

import { vi } from "vitest";
import { Schema } from "prosemirror-model";
import { EditorState, NodeSelection } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import insertFiles from "../commands/insertFiles";
import Attachment from "./Attachment";

vi.mock("../commands/insertFiles", () => ({
  __esModule: true,
  default: vi.fn(),
}));

const mockedInsertFiles = vi.mocked(insertFiles);

afterEach(() => {
  vi.restoreAllMocks();
  mockedInsertFiles.mockReset();
});

describe("Attachment", () => {
  it("forces replacement files to remain attachment nodes", () => {
    const extension = new Attachment();
    const schema = new Schema({
      nodes: {
        doc: { content: "attachment*" },
        attachment: extension.schema,
        text: { group: "inline" },
      },
    });
    const doc = schema.node("doc", undefined, [
      schema.node("attachment", {
        href: "/api/attachments.redirect?id=old",
        title: "old-file.png",
        size: 1,
        contentType: "image/png",
        preview: false,
      }),
    ]);
    const state = EditorState.create({
      doc,
      selection: NodeSelection.create(doc, 0),
    });
    const view = {
      state,
      dispatch: vi.fn(),
    } as unknown as EditorView;
    const uploadFile = vi.fn();

    extension.bindEditor({
      view,
      schema,
      commands: {},
      props: { uploadFile },
    } as never);

    const input = document.createElement("input");
    vi.spyOn(document, "createElement").mockReturnValueOnce(input);
    vi.spyOn(input, "click").mockImplementation(() => undefined);

    const commands = extension.commands({ type: schema.nodes.attachment });
    const replaceAttachment = commands.replaceAttachment();

    expect(replaceAttachment(state)).toBe(true);

    const replacement = new File(["replacement"], "new-file.png", {
      type: "image/png",
    });
    Object.defineProperty(input, "files", {
      configurable: true,
      value: [replacement],
    });
    input.dispatchEvent(new Event("change"));

    expect(mockedInsertFiles).toHaveBeenCalledWith(
      view,
      expect.any(Event),
      0,
      [replacement],
      expect.objectContaining({
        uploadFile,
        isAttachment: true,
        replaceExisting: true,
        attrs: { preview: false },
      })
    );
  });
});
