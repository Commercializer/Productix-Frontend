/* ─────────────────────────────────────────────
 * Elements - Barrel export + registration
 *
 * Importing this file registers all element types
 * in the global registry.
 * ──────────────────────────────────────────── */

// Import each element to trigger registration side-effects
import "./text-element";
import "./image-element";
import "./button-element";
import "./card-element";
import "./icon-element";
import "./badge-element";
import "./social-group";
import "./social-icon-element";
import "./whatsapp-button-element";
import "./stat-card";
import "./promo-card";
import "./divider-element";
import "./container-element";
import "./row-element";
import "./column-element";
import "./video-element";
import "./audio-element";
import "./feedback-element";
import "./search-element";
import "./shape-element";
import "./carousel-element";

// Re-export registry API for consumers
export {
  registerElement,
  getElementDefinition,
  getAllElements,
  getElementsByCategory,
  type ElementDefinition,
  type ElementRenderProps,
  type PropertyPanelProps,
} from "./registry";
