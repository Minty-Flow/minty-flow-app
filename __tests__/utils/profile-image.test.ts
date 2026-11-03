import { beforeEach, describe, expect, it, vi } from "vitest"

// Files present in app storage, by name.
const present = vi.hoisted(() => new Set<string>())
vi.mock("expo-file-system", () => ({
  Paths: { document: "file:///new-container/Documents" },
  File: class {
    uri: string
    private name: string
    constructor(dir: string, name: string) {
      this.name = name
      this.uri = `${dir}/${name}`
    }
    get exists() {
      return present.has(this.name)
    }
    delete() {
      present.delete(this.name)
    }
  },
}))

import {
  deleteProfileImage,
  migrateStoredProfileImage,
  profileImageFileName,
  resolveProfileImage,
} from "~/utils/profile-image"

beforeEach(() => present.clear())

describe("profileImageFileName", () => {
  it("keeps a bare file name", () => {
    expect(profileImageFileName("minty_profile_1.jpg")).toBe(
      "minty_profile_1.jpg",
    )
  })

  it("strips the directory of a legacy absolute URI", () => {
    expect(
      profileImageFileName(
        "file:///old-container/Documents/minty_profile_1.jpg",
      ),
    ).toBe("minty_profile_1.jpg")
  })
})

describe("resolveProfileImage", () => {
  it("resolves a file name against the current document directory", () => {
    present.add("minty_profile_1.jpg")
    expect(resolveProfileImage("minty_profile_1.jpg")).toBe(
      "file:///new-container/Documents/minty_profile_1.jpg",
    )
  })

  it("still finds the photo when a legacy URI points at an old container", () => {
    present.add("minty_profile_1.jpg")
    expect(
      resolveProfileImage(
        "file:///old-container/Documents/minty_profile_1.jpg",
      ),
    ).toBe("file:///new-container/Documents/minty_profile_1.jpg")
  })

  it("returns null for no photo or a missing file, so the fallback shows", () => {
    expect(resolveProfileImage(null)).toBeNull()
    expect(resolveProfileImage("gone.jpg")).toBeNull()
  })
})

describe("migrateStoredProfileImage", () => {
  it("converts a legacy URI to a file name when the file still exists", () => {
    present.add("minty_profile_1.jpg")
    expect(
      migrateStoredProfileImage(
        "file:///old-container/Documents/minty_profile_1.jpg",
      ),
    ).toBe("minty_profile_1.jpg")
  })

  it("drops a legacy URI whose file is gone", () => {
    expect(
      migrateStoredProfileImage("file:///old-container/Documents/gone.jpg"),
    ).toBeNull()
  })

  it("keeps nothing for null", () => {
    expect(migrateStoredProfileImage(null)).toBeNull()
  })
})

describe("deleteProfileImage", () => {
  it("deletes the file and ignores a missing one", () => {
    present.add("a.jpg")
    deleteProfileImage("a.jpg")
    expect(present.has("a.jpg")).toBe(false)
    expect(() => deleteProfileImage("a.jpg")).not.toThrow()
    expect(() => deleteProfileImage(null)).not.toThrow()
  })
})
