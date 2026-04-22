/* ─────────────────────────────────────────────
 * Translations — English, Sinhala, Tamil
 *
 * Product Experience Builder terminology
 * ──────────────────────────────────────────── */

export type Locale = "en" | "si" | "ta";

export interface LocaleMeta {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LOCALES: LocaleMeta[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "si", label: "Sinhala", nativeLabel: "සිංහල", flag: "🇱🇰" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", flag: "🇱🇰" },
];

/* ─── Translation keys ─────────────────────── */

export interface TranslationStrings {
  // Top toolbar
  "toolbar.undo": string;
  "toolbar.redo": string;
  "toolbar.preview": string;
  "toolbar.save": string;
  "toolbar.saveDraft": string;
  "toolbar.generateQR": string;
  "toolbar.fitToView": string;
  "toolbar.centerCanvas": string;
  "toolbar.panMode": string;
  "toolbar.scanPreview": string;
  "toolbar.mobileView": string;
  "toolbar.desktopView": string;

  // Device presets
  "device.desktop": string;
  "device.laptop": string;
  "device.tablet": string;
  "device.mobile": string;

  // Left panel tabs — product experience naming
  "tab.add": string;
  "tab.layers": string;
  "tab.canvas": string;
  "tab.storyBlocks": string;
  "tab.blockOrder": string;
  "tab.experience": string;

  // Story Blocks panel (was Element panel)
  "elements.title": string;
  "elements.category.content": string;
  "elements.category.media": string;
  "elements.category.interactive": string;
  "elements.category.layout": string;
  "elements.category.social": string;
  "elements.category.promotional": string;
  "elements.category.gaming": string;
  "storyBlocks.title": string;
  "storyBlocks.category.productStory": string;
  "storyBlocks.category.visuals": string;
  "storyBlocks.category.engagement": string;
  "storyBlocks.category.structure": string;
  "storyBlocks.category.socialProof": string;
  "storyBlocks.category.conversion": string;
  "storyBlocks.addBlock": string;
  "storyBlocks.empty": string;

  // Block Order panel (was Layer panel)
  "layers.title": string;
  "layers.empty": string;
  "layers.emptyHint": string;
  "layers.hide": string;
  "layers.show": string;
  "layers.lock": string;
  "layers.unlock": string;
  "blockOrder.title": string;
  "blockOrder.empty": string;
  "blockOrder.emptyHint": string;

  // Block Settings panel (was Properties panel)
  "properties.title": string;
  "properties.noSelection": string;
  "properties.noSelectionHint": string;
  "properties.multipleSelected": string;
  "properties.positionSize": string;
  "properties.rotation": string;
  "properties.opacity": string;
  "properties.elementSettings": string;
  "properties.layerOrder": string;
  "properties.top": string;
  "properties.up": string;
  "properties.down": string;
  "properties.bottom": string;
  "properties.duplicate": string;
  "properties.lock": string;
  "properties.unlock": string;
  "properties.delete": string;
  "properties.resetToAuto": string;
  "properties.overrideActive": string;
  "properties.autoScaled": string;
  "properties.mode": string;
  "blockSettings.title": string;
  "blockSettings.noSelection": string;
  "blockSettings.noSelectionHint": string;
  "blockSettings.blockContent": string;
  "blockSettings.sizing": string;
  "blockSettings.blockOrder": string;
  "blockSettings.appearance": string;

  // Experience Canvas (was Artboard settings)
  "artboard.title": string;
  "artboard.name": string;
  "artboard.width": string;
  "artboard.height": string;
  "artboard.presets": string;
  "artboard.bgColor": string;
  "artboard.bgImage": string;
  "artboard.add": string;
  "artboard.remove": string;
  "experience.title": string;
  "experience.name": string;
  "experience.background": string;
  "experience.coverImage": string;
  "experience.screenSize": string;

  // Floating toolbar
  "float.duplicate": string;
  "float.bringToFront": string;
  "float.sendToBack": string;
  "float.lock": string;
  "float.unlock": string;
  "float.delete": string;

  // Status bar
  "status.elements": string;
  "status.artboard": string;
  "status.artboards": string;
  "status.selected": string;
  "status.panHint": string;
  "status.blocks": string;
  "status.mobilePreview": string;

  // Language
  "language.title": string;

  // Tour
  "tour.welcome.title": string;
  "tour.welcome.desc": string;
  "tour.topbar.title": string;
  "tour.topbar.desc": string;
  "tour.leftrail.title": string;
  "tour.leftrail.desc": string;
  "tour.themes.title": string;
  "tour.themes.desc": string;
  "tour.btn.themes.desc": string;
  "tour.blocks.title": string;
  "tour.blocks.desc": string;
  "tour.btn.blocks.desc": string;
  "tour.order.title": string;
  "tour.order.desc": string;
  "tour.btn.order.desc": string;
  "tour.canvas_settings.title": string;
  "tour.canvas_settings.desc": string;
  "tour.btn.canvas.desc": string;
  "tour.canvas.title": string;
  "tour.canvas.desc": string;
  "tour.publish.title": string;
  "tour.publish.desc": string;
}

/* ─── English ──────────────────────────────── */

const en: TranslationStrings = {
  "toolbar.undo": "Undo",
  "toolbar.redo": "Redo",
  "toolbar.preview": "Preview",
  "toolbar.save": "Save",
  "toolbar.saveDraft": "Save Draft",
  "toolbar.generateQR": "Generate QR Experience",
  "toolbar.fitToView": "Fit to View",
  "toolbar.centerCanvas": "Center Canvas",
  "toolbar.panMode": "Pan mode — drag to move canvas",
  "toolbar.scanPreview": "Scan Preview",
  "toolbar.mobileView": "Mobile",
  "toolbar.desktopView": "Desktop",

  "device.desktop": "Desktop",
  "device.laptop": "Laptop",
  "device.tablet": "Tablet",
  "device.mobile": "Mobile",

  "tab.add": "Add",
  "tab.layers": "Layers",
  "tab.canvas": "Canvas",
  "tab.storyBlocks": "Story Blocks",
  "tab.blockOrder": "Block Order",
  "tab.experience": "Experience",

  "elements.title": "Elements",
  "elements.category.content": "Content",
  "elements.category.media": "Media",
  "elements.category.interactive": "Interactive",
  "elements.category.layout": "Layout",
  "elements.category.social": "Social",
  "elements.category.promotional": "Promotional",
  "elements.category.gaming": "Gaming",
  "storyBlocks.title": "Story Blocks",
  "storyBlocks.category.productStory": "Product Story",
  "storyBlocks.category.visuals": "Visuals",
  "storyBlocks.category.engagement": "Engagement",
  "storyBlocks.category.structure": "Structure",
  "storyBlocks.category.socialProof": "Social Proof",
  "storyBlocks.category.conversion": "Conversion",
  "storyBlocks.addBlock": "Add Story Block",
  "storyBlocks.empty": "Tap to add your first story block",

  "layers.title": "Layers",
  "layers.empty": "No elements on canvas",
  "layers.emptyHint": "Add elements from the panel above",
  "layers.hide": "Hide",
  "layers.show": "Show",
  "layers.lock": "Lock",
  "layers.unlock": "Unlock",
  "blockOrder.title": "Block Order",
  "blockOrder.empty": "No blocks yet",
  "blockOrder.emptyHint": "Add story blocks to start building",

  "properties.title": "Properties",
  "properties.noSelection": "No element selected",
  "properties.noSelectionHint": "Click an element on the canvas to edit its properties",
  "properties.multipleSelected": "elements selected",
  "properties.positionSize": "Position & Size",
  "properties.rotation": "Rotation",
  "properties.opacity": "Opacity",
  "properties.elementSettings": "Element Settings",
  "properties.layerOrder": "Layer Order",
  "properties.top": "Top",
  "properties.up": "Up",
  "properties.down": "Down",
  "properties.bottom": "Bot",
  "properties.duplicate": "Duplicate",
  "properties.lock": "Lock",
  "properties.unlock": "Unlock",
  "properties.delete": "Delete",
  "properties.resetToAuto": "Reset to Auto",
  "properties.overrideActive": "Custom override active — values differ from auto-scale",
  "properties.autoScaled": "Auto-scaled from desktop — edit to create a custom override",
  "properties.mode": "Mode",
  "blockSettings.title": "Block Settings",
  "blockSettings.noSelection": "No block selected",
  "blockSettings.noSelectionHint": "Tap a block on the screen to edit it",
  "blockSettings.blockContent": "Block Content",
  "blockSettings.sizing": "Sizing",
  "blockSettings.blockOrder": "Block Order",
  "blockSettings.appearance": "Appearance",

  "artboard.title": "Artboard",
  "artboard.name": "Name",
  "artboard.width": "Width",
  "artboard.height": "Height",
  "artboard.presets": "Presets",
  "artboard.bgColor": "Background Color",
  "artboard.bgImage": "Background Image",
  "artboard.add": "+ Add Artboard",
  "artboard.remove": "Remove",
  "experience.title": "Experience Canvas",
  "experience.name": "Experience Name",
  "experience.background": "Background",
  "experience.coverImage": "Cover Image",
  "experience.screenSize": "Screen Size",

  "float.duplicate": "Duplicate",
  "float.bringToFront": "Bring to Front",
  "float.sendToBack": "Send to Back",
  "float.lock": "Lock",
  "float.unlock": "Unlock",
  "float.delete": "Delete",

  "status.elements": "elements",
  "status.artboard": "artboard",
  "status.artboards": "artboards",
  "status.selected": "selected",
  "status.panHint": "Space+drag to pan · Ctrl+Scroll to zoom",
  "status.blocks": "blocks",
  "status.mobilePreview": "Mobile Preview",

  "language.title": "Language",

  "tour.welcome.title": "Welcome to Product Experience Builder!",
  "tour.welcome.desc": "Let's take a quick tour of your new workspace.",
  "tour.topbar.title": "Top Navigation",
  "tour.topbar.desc": "Change your document name, undo/redo actions, and manage multi-language content here.",
  "tour.leftrail.title": "Tool Panels",
  "tour.leftrail.desc": "Access your Story Blocks, Themes, Layer order, and Canvas settings from this rail.",
  "tour.themes.title": "Themes",
  "tour.themes.desc": "Quickly switch the overall look and feel of your experience using our curated themes.",
  "tour.btn.themes.desc": "Open the Themes panel from here.",
  "tour.blocks.title": "Story Blocks",
  "tour.blocks.desc": "Drag and drop these pre-built, responsive blocks to assemble your product story.",
  "tour.btn.blocks.desc": "Open the Story Blocks panel from here.",
  "tour.order.title": "Block Order",
  "tour.order.desc": "Reorder, hide, or lock the blocks you've added to the canvas.",
  "tour.btn.order.desc": "Open the Block Order panel from here.",
  "tour.canvas_settings.title": "Canvas Settings",
  "tour.canvas_settings.desc": "Change the background, visual effects, and overall size of your canvas.",
  "tour.btn.canvas.desc": "Open the Canvas Settings panel from here.",
  "tour.canvas.title": "The Canvas",
  "tour.canvas.desc": "Your mobile-first workspace. Click and drag blocks, hold Space to pan, and scroll to zoom.",
  "tour.publish.title": "Preview & Publish",
  "tour.publish.desc": "Scan the QR code to preview on your actual phone, and save or publish your experience when ready.",
};

/* ─── Sinhala (සිංහල) ──────────────────────── */

const si: TranslationStrings = {
  "toolbar.undo": "අහෝසි කරන්න",
  "toolbar.redo": "නැවත කරන්න",
  "toolbar.preview": "පෙරදසුන",
  "toolbar.save": "සුරකින්න",
  "toolbar.saveDraft": "කෙටුම්පත සුරකින්න",
  "toolbar.generateQR": "QR අත්දැකීම සාදන්න",
  "toolbar.fitToView": "දර්ශනයට ගැළපෙන්න",
  "toolbar.centerCanvas": "කැන්වසය මැද කරන්න",
  "toolbar.panMode": "සැරිසැරීමේ ආකාරය — කැන්වසය ගෙනයන්න අදින්න",
  "toolbar.scanPreview": "ස්කෑන් පෙරදසුන",
  "toolbar.mobileView": "ජංගම",
  "toolbar.desktopView": "ඩෙස්ක්ටොප්",

  "device.desktop": "ඩෙස්ක්ටොප්",
  "device.laptop": "ලැප්ටොප්",
  "device.tablet": "ටැබ්ලට්",
  "device.mobile": "ජංගම",

  "tab.add": "එකතු කරන්න",
  "tab.layers": "ස්ථර",
  "tab.canvas": "කැන්වසය",
  "tab.storyBlocks": "කතා කොටස්",
  "tab.blockOrder": "කොටස් අනුපිළිවෙල",
  "tab.experience": "අත්දැකීම",

  "elements.title": "මූලද්‍රව්‍ය",
  "elements.category.content": "අන්තර්ගතය",
  "elements.category.media": "මාධ්‍ය",
  "elements.category.interactive": "අන්තර්ක්‍රියා",
  "elements.category.layout": "පිරිසැලසුම",
  "elements.category.social": "සමාජ",
  "elements.category.promotional": "ප්‍රවර්ධන",
  "elements.category.gaming": "ක්‍රීඩා",
  "storyBlocks.title": "කතා කොටස්",
  "storyBlocks.category.productStory": "නිෂ්පාදන කතාව",
  "storyBlocks.category.visuals": "දෘශ්‍ය",
  "storyBlocks.category.engagement": "සම්බන්ධතාව",
  "storyBlocks.category.structure": "ව්‍යුහය",
  "storyBlocks.category.socialProof": "සමාජ සාක්ෂි",
  "storyBlocks.category.conversion": "පරිවර්තනය",
  "storyBlocks.addBlock": "කතා කොටසක් එකතු කරන්න",
  "storyBlocks.empty": "ඔබේ පළමු කතා කොටස එකතු කිරීමට තට්ටු කරන්න",

  "layers.title": "ස්ථර",
  "layers.empty": "කැන්වසය මත මූලද්‍රව්‍ය නැත",
  "layers.emptyHint": "ඉහත පැනලයෙන් මූලද්‍රව්‍ය එකතු කරන්න",
  "layers.hide": "සඟවන්න",
  "layers.show": "පෙන්වන්න",
  "layers.lock": "අගුළු දමන්න",
  "layers.unlock": "අගුළු හරින්න",
  "blockOrder.title": "කොටස් අනුපිළිවෙල",
  "blockOrder.empty": "තවම කොටස් නැත",
  "blockOrder.emptyHint": "ගොඩනැගීම ආරම්භ කිරීමට කතා කොටස් එකතු කරන්න",

  "properties.title": "ගුණාංග",
  "properties.noSelection": "මූලද්‍රව්‍යයක් තෝරා නැත",
  "properties.noSelectionHint": "ගුණාංග සංස්කරණය කිරීමට කැන්වසය මත මූලද්‍රව්‍යයක් ක්ලික් කරන්න",
  "properties.multipleSelected": "මූලද්‍රව්‍ය තෝරා ඇත",
  "properties.positionSize": "ස්ථානය සහ ප්‍රමාණය",
  "properties.rotation": "භ්‍රමණය",
  "properties.opacity": "පාරාන්ධතාව",
  "properties.elementSettings": "මූලද්‍රව්‍ය සැකසුම්",
  "properties.layerOrder": "ස්ථර අනුපිළිවෙල",
  "properties.top": "ඉහළට",
  "properties.up": "ඉහළ",
  "properties.down": "පහළ",
  "properties.bottom": "පහළට",
  "properties.duplicate": "අනුපිටපත්",
  "properties.lock": "අගුළු දමන්න",
  "properties.unlock": "අගුළු හරින්න",
  "properties.delete": "මකන්න",
  "properties.resetToAuto": "ස්වයං වෙත නැවත සකසන්න",
  "properties.overrideActive": "අභිරුචි ප්‍රතිස්ථාපනය සක්‍රියයි — අගයන් ස්වයං-පරිමාණයට වෙනස්ය",
  "properties.autoScaled": "ඩෙස්ක්ටොප් එකෙන් ස්වයංක්‍රීයව පරිමාණය — අභිරුචි සෑදීමට සංස්කරණය කරන්න",
  "properties.mode": "ආකාරය",
  "blockSettings.title": "කොටස් සැකසුම්",
  "blockSettings.noSelection": "කොටසක් තෝරා නැත",
  "blockSettings.noSelectionHint": "සංස්කරණය කිරීමට තිරය මත කොටසක් තට්ටු කරන්න",
  "blockSettings.blockContent": "කොටස් අන්තර්ගතය",
  "blockSettings.sizing": "ප්‍රමාණය",
  "blockSettings.blockOrder": "කොටස් අනුපිළිවෙල",
  "blockSettings.appearance": "පෙනුම",

  "artboard.title": "ආට්බෝඩ්",
  "artboard.name": "නම",
  "artboard.width": "පළල",
  "artboard.height": "උස",
  "artboard.presets": "පෙරසැකසුම්",
  "artboard.bgColor": "පසුබිම් වර්ණය",
  "artboard.bgImage": "පසුබිම් රූපය",
  "artboard.add": "+ ආට්බෝඩ් එකතු කරන්න",
  "artboard.remove": "ඉවත් කරන්න",
  "experience.title": "අත්දැකීම් කැන්වසය",
  "experience.name": "අත්දැකීම් නම",
  "experience.background": "පසුබිම",
  "experience.coverImage": "ආවරණ රූපය",
  "experience.screenSize": "තිර ප්‍රමාණය",

  "float.duplicate": "අනුපිටපත්",
  "float.bringToFront": "ඉදිරියට ගෙන එන්න",
  "float.sendToBack": "පිටුපසට යවන්න",
  "float.lock": "අගුළු දමන්න",
  "float.unlock": "අගුළු හරින්න",
  "float.delete": "මකන්න",

  "status.elements": "මූලද්‍රව්‍ය",
  "status.artboard": "ආට්බෝඩ්",
  "status.artboards": "ආට්බෝඩ්",
  "status.selected": "තෝරා ඇත",
  "status.panHint": "Space+අදින්න · Ctrl+Scroll සූම්",
  "status.blocks": "කොටස්",
  "status.mobilePreview": "ජංගම පෙරදසුන",

  "language.title": "භාෂාව",

  "tour.welcome.title": "නිෂ්පාදන අත්දැකීම් ගොඩනගන්නා වෙත සාදරයෙන් පිළිගනිමු!",
  "tour.welcome.desc": "අපි ඔබේ නව සේවා ස්ථානයේ ඉක්මන් චාරිකාවක් යමු.",
  "tour.topbar.title": "ඉහළ සංචලනය",
  "tour.topbar.desc": "ඔබේ ලේඛන නම වෙනස් කරන්න, ක්‍රියා අහෝසි/නැවත කරන්න, සහ බහු-භාෂා අන්තර්ගත කළමනාකරණය කරන්න.",
  "tour.leftrail.title": "මෙවලම් පැනල",
  "tour.leftrail.desc": "මෙම රේල් පීල්ලෙන් කතා කොටස්, තේමා, ස්ථර අනුපිළිවෙල සහ කැන්වස් සැකසුම් වෙත ප්‍රවේශ වන්න.",
  "tour.themes.title": "තේමා",
  "tour.themes.desc": "අපගේ තේමා භාවිතයෙන් ඔබේ අත්දැකීමේ සමස්ත පෙනුම සහ හැඟීම ඉක්මනින් වෙනස් කරන්න.",
  "tour.btn.themes.desc": "මෙතැනින් තේමා පැනලය විවෘත කරන්න.",
  "tour.blocks.title": "කතා කොටස්",
  "tour.blocks.desc": "ඔබේ නිෂ්පාදන කතාව එකලස් කිරීම සඳහා මෙම කොටස් ඇද දමන්න.",
  "tour.btn.blocks.desc": "මෙතැනින් කතා කොටස් පැනලය විවෘත කරන්න.",
  "tour.order.title": "කොටස් අනුපිළිවෙල",
  "tour.order.desc": "කැන්වසයට එක් කළ කොටස් ප්‍රතිසංවිධානය, සැඟවීම හෝ අගුළු දැමීම.",
  "tour.btn.order.desc": "මෙතැනින් කොටස් අනුපිළිවෙල පැනලය විවෘත කරන්න.",
  "tour.canvas_settings.title": "කැන්වස් සැකසුම්",
  "tour.canvas_settings.desc": "කැන්වසයේ පසුබිම, දෘශ්‍ය ප්‍රයෝග සහ සමස්ත ප්‍රමාණය වෙනස් කරන්න.",
  "tour.btn.canvas.desc": "මෙතැනින් කැන්වස් සැකසුම් පැනලය විවෘත කරන්න.",
  "tour.canvas.title": "කැන්වසය",
  "tour.canvas.desc": "ඔබේ ජංගම-පළමු සේවා ස්ථානය. කොටස් ක්ලික් කර අදින්න, පෑන් කිරීමට Space අල්ලාගෙන සිටින්න.",
  "tour.publish.title": "පෙරදසුන සහ ප්‍රකාශනය",
  "tour.publish.desc": "ඔබේ දුරකථනයේ පෙරදසුනක් බැලීමට QR කේතය ස්කෑන් කර, සූදානම් වූ පසු සුරකින්න හෝ ප්‍රකාශ කරන්න.",
};

/* ─── Tamil (தமிழ்) ──────────────────────── */

const ta: TranslationStrings = {
  "toolbar.undo": "செயல்தவிர்",
  "toolbar.redo": "மீண்டும் செய்",
  "toolbar.preview": "முன்னோட்டம்",
  "toolbar.save": "சேமி",
  "toolbar.saveDraft": "வரைவை சேமி",
  "toolbar.generateQR": "QR அனுபவத்தை உருவாக்கு",
  "toolbar.fitToView": "காட்சிக்கு பொருத்து",
  "toolbar.centerCanvas": "கேன்வாசை நடுவில் வை",
  "toolbar.panMode": "நகர்வு முறை — கேன்வாசை நகர்த்த இழுக்கவும்",
  "toolbar.scanPreview": "ஸ்கேன் முன்னோட்டம்",
  "toolbar.mobileView": "மொபைல்",
  "toolbar.desktopView": "டெஸ்க்டாப்",

  "device.desktop": "டெஸ்க்டாப்",
  "device.laptop": "லேப்டாப்",
  "device.tablet": "டேப்லெட்",
  "device.mobile": "மொபைல்",

  "tab.add": "சேர்",
  "tab.layers": "அடுக்குகள்",
  "tab.canvas": "கேன்வாஸ்",
  "tab.storyBlocks": "கதை தொகுதிகள்",
  "tab.blockOrder": "தொகுதி வரிசை",
  "tab.experience": "அனுபவம்",

  "elements.title": "உறுப்புகள்",
  "elements.category.content": "உள்ளடக்கம்",
  "elements.category.media": "ஊடகம்",
  "elements.category.interactive": "ஊடாடும்",
  "elements.category.layout": "தளவமைப்பு",
  "elements.category.social": "சமூக",
  "elements.category.promotional": "விளம்பர",
  "elements.category.gaming": "விளையாட்டுகள்",
  "storyBlocks.title": "கதை தொகுதிகள்",
  "storyBlocks.category.productStory": "தயாரிப்பு கதை",
  "storyBlocks.category.visuals": "காட்சிகள்",
  "storyBlocks.category.engagement": "ஈடுபாடு",
  "storyBlocks.category.structure": "அமைப்பு",
  "storyBlocks.category.socialProof": "சமூக சான்று",
  "storyBlocks.category.conversion": "மாற்றம்",
  "storyBlocks.addBlock": "கதை தொகுதி சேர்",
  "storyBlocks.empty": "உங்கள் முதல் கதை தொகுதியை சேர்க்க தட்டவும்",

  "layers.title": "அடுக்குகள்",
  "layers.empty": "கேன்வாசில் உறுப்புகள் இல்லை",
  "layers.emptyHint": "மேலே உள்ள பேனலில் இருந்து உறுப்புகளை சேர்க்கவும்",
  "layers.hide": "மறை",
  "layers.show": "காட்டு",
  "layers.lock": "பூட்டு",
  "layers.unlock": "திற",
  "blockOrder.title": "தொகுதி வரிசை",
  "blockOrder.empty": "இன்னும் தொகுதிகள் இல்லை",
  "blockOrder.emptyHint": "கட்டமைக்க கதை தொகுதிகளை சேர்க்கவும்",

  "properties.title": "பண்புகள்",
  "properties.noSelection": "உறுப்பு தேர்ந்தெடுக்கப்படவில்லை",
  "properties.noSelectionHint": "பண்புகளை திருத்த கேன்வாசில் ஒரு உறுப்பை க்ளிக் செய்யவும்",
  "properties.multipleSelected": "உறுப்புகள் தேர்ந்தெடுக்கப்பட்டன",
  "properties.positionSize": "நிலை & அளவு",
  "properties.rotation": "சுழற்சி",
  "properties.opacity": "ஒளிபுகாநிலை",
  "properties.elementSettings": "உறுப்பு அமைப்புகள்",
  "properties.layerOrder": "அடுக்கு வரிசை",
  "properties.top": "மேல்",
  "properties.up": "மேலே",
  "properties.down": "கீழே",
  "properties.bottom": "கீழ்",
  "properties.duplicate": "நகல்",
  "properties.lock": "பூட்டு",
  "properties.unlock": "திற",
  "properties.delete": "நீக்கு",
  "properties.resetToAuto": "தானியங்கிக்கு மீட்டமை",
  "properties.overrideActive": "தனிப்பயன் மீறல் செயலில் — மதிப்புகள் தானியங்கி-அளவிலிருந்து வேறுபடுகின்றன",
  "properties.autoScaled": "டெஸ்க்டாப்பிலிருந்து தானியங்கி அளவு — தனிப்பயன் மீறலை உருவாக்க திருத்தவும்",
  "properties.mode": "முறை",
  "blockSettings.title": "தொகுதி அமைப்புகள்",
  "blockSettings.noSelection": "தொகுதி தேர்ந்தெடுக்கப்படவில்லை",
  "blockSettings.noSelectionHint": "திருத்த திரையில் ஒரு தொகுதியை தட்டவும்",
  "blockSettings.blockContent": "தொகுதி உள்ளடக்கம்",
  "blockSettings.sizing": "அளவு",
  "blockSettings.blockOrder": "தொகுதி வரிசை",
  "blockSettings.appearance": "தோற்றம்",

  "artboard.title": "ஆர்ட்போர்டு",
  "artboard.name": "பெயர்",
  "artboard.width": "அகலம்",
  "artboard.height": "உயரம்",
  "artboard.presets": "முன்னமைவுகள்",
  "artboard.bgColor": "பின்னணி நிறம்",
  "artboard.bgImage": "பின்னணி படம்",
  "artboard.add": "+ ஆர்ட்போர்டு சேர்",
  "artboard.remove": "நீக்கு",
  "experience.title": "அனுபவ கேன்வாஸ்",
  "experience.name": "அனுபவ பெயர்",
  "experience.background": "பின்னணி",
  "experience.coverImage": "அட்டைப் படம்",
  "experience.screenSize": "திரை அளவு",

  "float.duplicate": "நகல்",
  "float.bringToFront": "முன்னால் கொண்டுவா",
  "float.sendToBack": "பின்னால் அனுப்பு",
  "float.lock": "பூட்டு",
  "float.unlock": "திற",
  "float.delete": "நீக்கு",

  "status.elements": "உறுப்புகள்",
  "status.artboard": "ஆர்ட்போர்டு",
  "status.artboards": "ஆர்ட்போர்டுகள்",
  "status.selected": "தேர்ந்தெடுக்கப்பட்டது",
  "status.panHint": "Space+இழுக்க · Ctrl+Scroll பெரிதாக்க",
  "status.blocks": "தொகுதிகள்",
  "status.mobilePreview": "மொபைல் முன்னோட்டம்",

  "language.title": "மொழி",

  "tour.welcome.title": "தயாரிப்பு அனுபவ பில்டருக்கு வருக!",
  "tour.welcome.desc": "உங்கள் புதிய பணியிடத்தின் விரைவான சுற்றுப்பயணத்தை மேற்கொள்வோம்.",
  "tour.topbar.title": "சிறந்த வழிசெலுத்தல்",
  "tour.topbar.desc": "உங்கள் ஆவணத்தின் பெயரை மாற்றவும், செயல்களை செயல்தவிர்/மீண்டும் செய்யவும்.",
  "tour.leftrail.title": "கருவி பேனல்கள்",
  "tour.leftrail.desc": "உங்கள் கதை தொகுதிகள், கருப்பொருள்கள், அடுக்கு வரிசையை அணுகவும்.",
  "tour.themes.title": "கருப்பொருள்கள்",
  "tour.themes.desc": "எங்கள் கருப்பொருள்களைப் பயன்படுத்தி ஒட்டுமொத்த தோற்றத்தையும் உணர்வையும் மாற்றவும்.",
  "tour.btn.themes.desc": "இங்கிருந்து கருப்பொருள்கள் பேனலைத் திறக்கவும்.",
  "tour.blocks.title": "கதை தொகுதிகள்",
  "tour.blocks.desc": "உங்கள் தயாரிப்பு கதையை உருவாக்க இந்த தொகுதிகளை இழுத்து விடவும்.",
  "tour.btn.blocks.desc": "இங்கிருந்து கதை தொகுதிகள் பேனலைத் திறக்கவும்.",
  "tour.order.title": "தொகுதி வரிசை",
  "tour.order.desc": "கேன்வாஸில் சேர்க்கப்பட்ட தொகுதிகளை மறுசீரமைக்கவும், மறைக்கவும் அல்லது பூட்டவும்.",
  "tour.btn.order.desc": "இங்கிருந்து தொகுதி வரிசை பேனலைத் திறக்கவும்.",
  "tour.canvas_settings.title": "கேன்வாஸ் அமைப்புகள்",
  "tour.canvas_settings.desc": "கேன்வாஸின் பின்னணி, காட்சி விளைவுகள் மற்றும் ஒட்டுமொத்த அளவை மாற்றவும்.",
  "tour.btn.canvas.desc": "இங்கிருந்து கேன்வாஸ் அமைப்புகள் பேனலைத் திறக்கவும்.",
  "tour.canvas.title": "கேன்வாஸ்",
  "tour.canvas.desc": "உங்கள் மொபைல்-முதல் பணியிடம். தொகுதிகளை இழுத்து விடவும்.",
  "tour.publish.title": "முன்னோட்டம் & வெளியிடு",
  "tour.publish.desc": "உங்கள் தொலைபேசியில் முன்னோட்டத்தைக் காண QR குறியீட்டை ஸ்கேன் செய்து சேமிக்கவும்.",
};

/* ─── All translations mapped by locale ────── */

export const translations: Record<Locale, TranslationStrings> = { en, si, ta };
