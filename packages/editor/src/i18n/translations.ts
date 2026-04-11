/* ─────────────────────────────────────────────
 * Translations — English, Sinhala, Tamil
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
  "toolbar.fitToView": string;
  "toolbar.centerCanvas": string;
  "toolbar.panMode": string;

  // Device presets
  "device.desktop": string;
  "device.laptop": string;
  "device.tablet": string;
  "device.mobile": string;

  // Left panel tabs
  "tab.add": string;
  "tab.layers": string;
  "tab.canvas": string;

  // Element panel
  "elements.title": string;
  "elements.category.content": string;
  "elements.category.media": string;
  "elements.category.interactive": string;
  "elements.category.layout": string;
  "elements.category.social": string;
  "elements.category.promotional": string;

  // Layer panel
  "layers.title": string;
  "layers.empty": string;
  "layers.emptyHint": string;
  "layers.hide": string;
  "layers.show": string;
  "layers.lock": string;
  "layers.unlock": string;

  // Properties panel
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

  // Artboard settings
  "artboard.title": string;
  "artboard.name": string;
  "artboard.width": string;
  "artboard.height": string;
  "artboard.presets": string;
  "artboard.bgColor": string;
  "artboard.bgImage": string;
  "artboard.add": string;
  "artboard.remove": string;

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

  // Language
  "language.title": string;
}

/* ─── English ──────────────────────────────── */

const en: TranslationStrings = {
  "toolbar.undo": "Undo",
  "toolbar.redo": "Redo",
  "toolbar.preview": "Preview",
  "toolbar.save": "Save",
  "toolbar.fitToView": "Fit to View",
  "toolbar.centerCanvas": "Center Canvas",
  "toolbar.panMode": "Pan mode — drag to move canvas",

  "device.desktop": "Desktop",
  "device.laptop": "Laptop",
  "device.tablet": "Tablet",
  "device.mobile": "Mobile",

  "tab.add": "Add",
  "tab.layers": "Layers",
  "tab.canvas": "Canvas",

  "elements.title": "Elements",
  "elements.category.content": "Content",
  "elements.category.media": "Media",
  "elements.category.interactive": "Interactive",
  "elements.category.layout": "Layout",
  "elements.category.social": "Social",
  "elements.category.promotional": "Promotional",

  "layers.title": "Layers",
  "layers.empty": "No elements on canvas",
  "layers.emptyHint": "Add elements from the panel above",
  "layers.hide": "Hide",
  "layers.show": "Show",
  "layers.lock": "Lock",
  "layers.unlock": "Unlock",

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

  "artboard.title": "Artboard",
  "artboard.name": "Name",
  "artboard.width": "Width",
  "artboard.height": "Height",
  "artboard.presets": "Presets",
  "artboard.bgColor": "Background Color",
  "artboard.bgImage": "Background Image",
  "artboard.add": "+ Add Artboard",
  "artboard.remove": "Remove",

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

  "language.title": "Language",
};

/* ─── Sinhala (සිංහල) ──────────────────────── */

const si: TranslationStrings = {
  "toolbar.undo": "අහෝසි කරන්න",
  "toolbar.redo": "නැවත කරන්න",
  "toolbar.preview": "පෙරදසුන",
  "toolbar.save": "සුරකින්න",
  "toolbar.fitToView": "දර්ශනයට ගැළපෙන්න",
  "toolbar.centerCanvas": "කැන්වසය මැද කරන්න",
  "toolbar.panMode": "සැරිසැරීමේ ආකාරය — කැන්වසය ගෙනයන්න අදින්න",

  "device.desktop": "ඩෙස්ක්ටොප්",
  "device.laptop": "ලැප්ටොප්",
  "device.tablet": "ටැබ්ලට්",
  "device.mobile": "ජංගම",

  "tab.add": "එකතු කරන්න",
  "tab.layers": "ස්ථර",
  "tab.canvas": "කැන්වසය",

  "elements.title": "මූලද්‍රව්‍ය",
  "elements.category.content": "අන්තර්ගතය",
  "elements.category.media": "මාධ්‍ය",
  "elements.category.interactive": "අන්තර්ක්‍රියා",
  "elements.category.layout": "පිරිසැලසුම",
  "elements.category.social": "සමාජ",
  "elements.category.promotional": "ප්‍රවර්ධන",

  "layers.title": "ස්ථර",
  "layers.empty": "කැන්වසය මත මූලද්‍රව්‍ය නැත",
  "layers.emptyHint": "ඉහත පැනලයෙන් මූලද්‍රව්‍ය එකතු කරන්න",
  "layers.hide": "සඟවන්න",
  "layers.show": "පෙන්වන්න",
  "layers.lock": "අගුළු දමන්න",
  "layers.unlock": "අගුළු හරින්න",

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

  "artboard.title": "ආට්බෝඩ්",
  "artboard.name": "නම",
  "artboard.width": "පළල",
  "artboard.height": "උස",
  "artboard.presets": "පෙරසැකසුම්",
  "artboard.bgColor": "පසුබිම් වර්ණය",
  "artboard.bgImage": "පසුබිම් රූපය",
  "artboard.add": "+ ආට්බෝඩ් එකතු කරන්න",
  "artboard.remove": "ඉවත් කරන්න",

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

  "language.title": "භාෂාව",
};

/* ─── Tamil (தமிழ்) ──────────────────────── */

const ta: TranslationStrings = {
  "toolbar.undo": "செயல்தவிர்",
  "toolbar.redo": "மீண்டும் செய்",
  "toolbar.preview": "முன்னோட்டம்",
  "toolbar.save": "சேமி",
  "toolbar.fitToView": "காட்சிக்கு பொருத்து",
  "toolbar.centerCanvas": "கேன்வாசை நடுவில் வை",
  "toolbar.panMode": "நகர்வு முறை — கேன்வாசை நகர்த்த இழுக்கவும்",

  "device.desktop": "டெஸ்க்டாப்",
  "device.laptop": "லேப்டாப்",
  "device.tablet": "டேப்லெட்",
  "device.mobile": "மொபைல்",

  "tab.add": "சேர்",
  "tab.layers": "அடுக்குகள்",
  "tab.canvas": "கேன்வாஸ்",

  "elements.title": "உறுப்புகள்",
  "elements.category.content": "உள்ளடக்கம்",
  "elements.category.media": "ஊடகம்",
  "elements.category.interactive": "ஊடாடும்",
  "elements.category.layout": "தளவமைப்பு",
  "elements.category.social": "சமூக",
  "elements.category.promotional": "விளம்பர",

  "layers.title": "அடுக்குகள்",
  "layers.empty": "கேன்வாசில் உறுப்புகள் இல்லை",
  "layers.emptyHint": "மேலே உள்ள பேனலில் இருந்து உறுப்புகளை சேர்க்கவும்",
  "layers.hide": "மறை",
  "layers.show": "காட்டு",
  "layers.lock": "பூட்டு",
  "layers.unlock": "திற",

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

  "artboard.title": "ஆர்ட்போர்டு",
  "artboard.name": "பெயர்",
  "artboard.width": "அகலம்",
  "artboard.height": "உயரம்",
  "artboard.presets": "முன்னமைவுகள்",
  "artboard.bgColor": "பின்னணி நிறம்",
  "artboard.bgImage": "பின்னணி படம்",
  "artboard.add": "+ ஆர்ட்போர்டு சேர்",
  "artboard.remove": "நீக்கு",

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

  "language.title": "மொழி",
};

/* ─── All translations mapped by locale ────── */

export const translations: Record<Locale, TranslationStrings> = { en, si, ta };
