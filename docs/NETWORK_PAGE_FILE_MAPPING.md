# Network Page – File Mapping (hyphens-frontend → hyphens-shinhan)

All **source** files related to the **network page** in `hyphens-frontend`, and where to implement them in `hyphens-shinhan` using the same code structure as `hyphens-shinhan/src`.

---

## 1. Page (tab route)

| hyphens-frontend | hyphens-shinhan |
|------------------|-----------------|
| `app/(yb)/networking/page.tsx` | `src/app/(tabs)/network/page.tsx` |

**Notes:**  
- In hyphens-shinhan, the tab layout (`TabsLayoutClient`) already provides the header (title "네트워크", nav items from `HEADER_CONFIG_BY_BOTTOM_NAV[ROUTES.NETWORK.MAIN]`). Do **not** import a separate `Header`; render only the page content (tabs + list/map content), similar to `(tabs)/community/page.tsx`.

---

## 2. Networking components (feature folder)

| hyphens-frontend | hyphens-shinhan |
|------------------|-----------------|
| `app/components/networking/RecommendedPeopleList.tsx` | `src/components/network/RecommendedPeopleList.tsx` |
| `app/components/networking/FollowingList.tsx` | `src/components/network/FollowingList.tsx` |
| `app/components/networking/FollowingPersonCard.tsx` | `src/components/network/FollowingPersonCard.tsx` |
| `app/components/networking/FollowRequestsList.tsx` | `src/components/network/FollowRequestsList.tsx` |
| `app/components/networking/PersonCard.tsx` | `src/components/network/PersonCard.tsx` |
| `app/components/networking/FriendRecommendationCard.tsx` | `src/components/network/FriendRecommendationCard.tsx` |
| `app/components/networking/CommonFriendsSection.tsx` | `src/components/network/CommonFriendsSection.tsx` |
| `app/components/networking/NearbyFriendsSection.tsx` | `src/components/network/NearbyFriendsSection.tsx` |
| `app/components/networking/NearbyPersonCard.tsx` | `src/components/network/NearbyPersonCard.tsx` |
| `app/components/networking/NetworkingTabs.tsx` | `src/components/network/NetworkingTabs.tsx` |
| `app/components/networking/ViewToggle.tsx` | `src/components/network/ViewToggle.tsx` |
| `app/components/networking/MentoringApplicationCard.tsx` | `src/components/network/MentoringApplicationCard.tsx` |
| `app/components/networking/MapView.tsx` | `src/components/network/MapView.tsx` |
| `app/components/networking/MapEventsHandler.tsx` | `src/components/network/MapEventsHandler.tsx` |
| `app/components/networking/NearbyPeopleSheet.tsx` | `src/components/network/NearbyPeopleSheet.tsx` |

**Notes:**  
- Use folder name `network` (singular) in hyphens-shinhan to match existing `community/`, `scholarship/` pattern.  
- Update imports: `@/app/components/networking/...` → `@/components/network/...` (hyphens-shinhan uses `@/` for `src/`).

---

## 3. Shared / external components used by the network page

| hyphens-frontend | hyphens-shinhan |
|------------------|-----------------|
| `app/components/shared/Header.tsx` | **Not needed.** Use the header from `TabsLayoutClient` (driven by `HEADER_CONFIG_BY_BOTTOM_NAV`). |
| `app/components/activities/ActivitiesMentorBanner.tsx` | Either add `src/components/network/ActivitiesMentorBanner.tsx` (copy/adapt) or a shared `src/components/common/` or `src/components/activities/` if you introduce an activities module. |

**Notes:**  
- hyphens-shinhan has no `app/components/shared/Header`; the tabs layout renders `CustomHeader` with config from constants.  
- If “멘토 배너” is network-only, keep it under `src/components/network/`. If reused elsewhere, put it in `src/components/common/`.

---

## 4. Data & types (lib → constants/types/services)

| hyphens-frontend | hyphens-shinhan |
|------------------|-----------------|
| `lib/data/mock-networking.ts` | `src/constants/network.ts` or `src/data/mock-network.ts` (mock data). Prefer constants if it’s only static lists; otherwise a small `data/` or `lib/` module. |
| `lib/types/networking.ts` | `src/types/network.ts` (and re-export from `src/types/index.ts` if you use a barrel). |

**Notes:**  
- hyphens-shinhan uses `src/types/*.ts` and `src/constants/`.  
- For real API later: add `src/services/network.ts` (or `follows.ts` if reusing plimate-server follows API) and `src/hooks/network/useNetwork.ts` (or `useFollows.ts`), following the pattern of `services/`, `hooks/` for community/scholarship.

---

## 5. Routes

| hyphens-frontend | hyphens-shinhan |
|------------------|-----------------|
| Route segment `(yb)/networking` → path `/networking` | Already defined: `ROUTES.NETWORK.MAIN` = `/network` in `src/constants/routes/network.ts`. No change needed. |

---

## 6. Summary checklist (implement in this order)

1. **Types**  
   - [ ] `src/types/network.ts` (from `lib/types/networking.ts`).

2. **Constants / mock data**  
   - [ ] `src/constants/network.ts` or `src/data/mock-network.ts` (from `lib/data/mock-networking.ts`).  
   - [ ] Re-export in `src/types/index.ts` if you add `network` types.

3. **Components** (create folder `src/components/network/`)  
   - [ ] `PersonCard.tsx`  
   - [ ] `FollowingPersonCard.tsx`  
   - [ ] `FollowingList.tsx`  
   - [ ] `FollowRequestsList.tsx`  
   - [ ] `RecommendedPeopleList.tsx`  
   - [ ] `FriendRecommendationCard.tsx`  
   - [ ] `CommonFriendsSection.tsx`  
   - [ ] `NearbyFriendsSection.tsx`  
   - [ ] `NearbyPersonCard.tsx`  
   - [ ] `NetworkingTabs.tsx`  
   - [ ] `ViewToggle.tsx`  
   - [ ] `MentoringApplicationCard.tsx`  
   - [ ] `MapEventsHandler.tsx`  
   - [ ] `MapView.tsx`  
   - [ ] `NearbyPeopleSheet.tsx`  
   - [ ] (Optional) `ActivitiesMentorBanner.tsx` under `network/` or `common/`.

4. **Page**  
   - [ ] `src/app/(tabs)/network/page.tsx`: replace placeholder with content from `app/(yb)/networking/page.tsx`, using `@/components/network/*` and layout-provided header (no standalone Header component).

5. **Optional (later)**  
   - [ ] `src/services/network.ts` or `follows.ts` when wiring to plimate-server.  
   - [ ] `src/hooks/network/useNetwork.ts` (or `useFollows.ts`) for data fetching.

---

## 7. Import path changes (hyphens-frontend → hyphens-shinhan)

- `@/app/components/networking/...` → `@/components/network/...`
- `@/app/components/shared/Header` → remove; use layout header only.
- `@/app/components/activities/ActivitiesMentorBanner` → `@/components/network/ActivitiesMentorBanner` (or `@/components/common/...` if shared).
- `@/lib/data/mock-networking` → `@/constants/network` or `@/data/mock-network`.
- `@/lib/types/networking` → `@/types/network`.

Use the same code structure as `hyphens-shinhan/src` (e.g. `components/community/`, `components/scholarship/`, `types/`, `constants/`, `app/(tabs)/`).
