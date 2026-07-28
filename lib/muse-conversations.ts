import type { Outfit } from '@/components/muse/outfit-card'
import type { ShopItem } from '@/components/muse/shopping-card'

export interface MuseReply {
  text: string
  transcript?: string
  reasoning?: string
  outfits?: Outfit[]
  shopping?: ShopItem[]
}

const OUTFIT = {
  morning: {
    title: 'Soft Morning',
    occasion: 'Everyday',
    image: '/outfits/outfit-morning.png',
    pieces: ['Cream cashmere', 'Wide-leg beige', 'White sneakers'],
  },
  evening: {
    title: 'Golden Hour',
    occasion: 'Dinner',
    image: '/outfits/outfit-evening.png',
    pieces: ['Rose slip dress', 'Camel coat', 'Nude heels'],
  },
  casual: {
    title: 'Weekend Ease',
    occasion: 'Casual',
    image: '/outfits/outfit-casual.png',
    pieces: ['Linen shirt', 'Peach shorts', 'Straw tote'],
  },
  sharp: {
    title: 'Sharp & Cool',
    occasion: 'Modern',
    image: '/outfits/outfit-sharp.png',
    pieces: ['Structured blazer', 'Straight ecru trousers', 'Ankle boots'],
  },
  playful: {
    title: 'Playful & Bright',
    occasion: 'Expressive',
    image: '/outfits/outfit-playful.png',
    pieces: ['Floral midi', 'Coral cardigan', 'Straw tote'],
  },
  soho: {
    title: 'Downtown After Dark',
    occasion: 'Rooftop dinner',
    image: '/outfits/outfit-soho.png',
    pieces: ['Leather midi skirt', 'Ivory silk cami', 'Moto jacket', 'Heels'],
  },
  interview: {
    title: 'Quietly Confident',
    occasion: 'Interview',
    image: '/outfits/outfit-interview.png',
    pieces: ['Navy blazer', 'Silk cami', 'Ecru trousers', 'Loafers'],
  },
  parisDay: {
    title: 'Left Bank Daytime',
    occasion: 'Paris · day',
    image: '/outfits/outfit-paris-day.png',
    pieces: ['Breton tee', 'Vintage jeans', 'Ballet flats', 'Trench'],
  },
  parisNight: {
    title: 'Dinner in the 6th',
    occasion: 'Paris · night',
    image: '/outfits/outfit-paris-night.png',
    pieces: ['Black column midi', 'Nude heels', 'Camel coat'],
  },
  quietLuxury: {
    title: 'Quiet Luxury',
    occasion: 'Expensive on nothing',
    image: '/outfits/outfit-quiet-luxury.png',
    pieces: ['Chocolate turtleneck', 'Ecru trousers', 'Camel coat', 'Tall boots'],
  },
} satisfies Record<string, Outfit>

const SHOP = {
  hoops: {
    name: 'Fine Gold Hoops',
    brand: 'Mejuri',
    price: '$120',
    image: '/shop/gold-hoops.png',
    reason: 'A warm metal to catch candlelight — the one thing your closet is missing here.',
  },
  scarf: {
    name: 'Silk Neck Scarf',
    brand: 'Sézane',
    price: '$85',
    image: '/shop/silk-scarf.png',
    reason: 'Ties the rose and peach together and adds a little movement.',
  },
  boots: {
    name: 'Leather Ankle Boots',
    brand: 'Everlane',
    price: '$228',
    image: '/shop/ankle-boots.png',
    reason: 'For cooler Lisbon evenings when espadrilles feel too light.',
  },
  tote: {
    name: 'Woven Straw Tote',
    brand: 'Loeffler Randall',
    price: '$195',
    image: '/shop/straw-tote.png',
    reason: 'Roomy enough for a day of wandering, and it reads instantly summer.',
  },
  blazer: {
    name: 'Relaxed Cream Blazer',
    brand: 'Toteme',
    price: '$410',
    image: '/shop/cream-blazer.png',
    reason: 'Throw it over the cashmere and your loungewear becomes an outfit.',
  },
} satisfies Record<string, ShopItem>

interface Intent {
  keywords: string[]
  reply: MuseReply
}

// Occasion-driven intents (the "what's the plan" replies).
// Specific scenarios come first so they win over the generic dinner/trip intents.
const INTENTS: Intent[] = [
  {
    keywords: ['rooftop', 'soho', 'so ho', 'downtown dinner'],
    reply: {
      text: "A rooftop in SoHo — okay, this is my favourite kind of night to dress you for. Black leather midi, ivory silk cami tucked in, the moto jacket over the top, heels. Soft meets tough, completely you. One honest note: skip the stilettos you'd normally reach for — rooftop decking eats thin heels alive, and it always cools off up there after dark, so the jacket is doing real work tonight. Are you walking over or cabbing? That's the only thing that changes my shoe.",
      transcript:
        "A rooftop in SoHo — this is exactly my kind of night. Here's the plan: your black leather midi skirt with the ivory silk camisole tucked in, the moto jacket thrown over, and a heel. It's that soft-meets-tough thing that always reads cool downtown — silk keeps it pretty, leather keeps it from going sweet. Two opinions while I have you: leave the stiletto at home, because rooftop decking and thin heels are a nightmare and you'll spend the night watching your feet instead of enjoying yourself — a block heel gives you the same line without the drama. And it genuinely drops ten degrees up high once the sun's gone, so the jacket isn't styling, it's survival. Gold hoops, the small black bag, done. So — are you walking there or grabbing a cab? If you're walking I'll swap in something you can actually cover ground in.",
      reasoning:
        "You lean pretty by default, so I'm deliberately roughing it up with leather — that contrast is what makes you look like you belong downtown rather than like you're visiting. The block heel and the jacket are practical calls, not fashion ones: rooftops are windy and uneven, and I'd rather you forget what you're wearing all night.",
      outfits: [OUTFIT.soho],
    },
  },
  {
    keywords: ['interview', 'startup', 'job', 'new job', 'first day', 'meeting them', 'work event'],
    reply: {
      text: "Interviewing at a startup — I've got opinions here. You want to look like you already belong, not like you're auditioning. Navy blazer, ivory silk cami, ecru straight trousers, black loafers. And please trust me on the flat shoe — a heel to a startup reads like you misjudged the room, and you never want your outfit to be the thing they remember. How senior is the role? If you're going in as a leader I'll sharpen it a notch; if it's your first role there I'll soften it so you seem easy to work with.",
      transcript:
        "Interviewing at a startup is a specific brief, and honestly it's one people get wrong constantly — too corporate and you look out of step with the culture, too casual and you look like you didn't care. So we thread it: navy double-breasted blazer, ivory silk camisole underneath, ecru straight trousers, black leather loafers. Here's where I'll gently overrule you if you were reaching for heels — don't. A flat, clean loafer at a startup says 'I get it, I'm ready to work,' where a heel can read like you misread the vibe, and first impressions are stubborn. Skip loud jewelry too; the blazer's gold buttons are enough, and the tan crossbody keeps your hands free to actually gesture and connect. Tell me how senior the role is — leadership or first rung? — because that's the dial I'd turn between authoritative and approachable.",
      reasoning:
        "The whole game here is looking like you already have the job. Structure says you're serious, the flat shoe and relaxed cami say you're easy to be around — and I'm steering you off heels on purpose because at a startup they read as trying too hard, which is the one impression you can't afford in the first ten seconds.",
      outfits: [OUTFIT.interview],
    },
  },
  {
    keywords: ['paris', 'five days', '5 days', 'parisian'],
    reply: {
      text: "Paris for five days — I'm a little jealous. Let me talk you out of overpacking before you start: you do not need five outfits, you need six pieces that recombine. Breton tee, vintage jeans, red ballet flats and the trench for wandering; the black column midi, nude heels and camel coat for a proper dinner. The scarf and crossbody tie it together. What's on the itinerary that's actually dressy — a dinner, the opera, someone's birthday? Tell me the one big night and I'll make sure we don't leave you scrambling for it.",
      transcript:
        "Paris for five days — I'm genuinely jealous. First, a firm opinion: resist the urge to pack an outfit per day. It's the number-one mistake, you'll haul a heavy bag full of things you never touch. The secret is pieces that recombine. Daytime is the Breton tee, vintage straight jeans, red ballet flats, and the trench belted at the waist — pure Left Bank, and kind to your feet on the cobbles, which matters more than you think by day three. Evenings, the black column midi with nude heels and the camel coat over the shoulders goes anywhere in the city. In between, swap the tee for the silk cami or the chocolate turtleneck and that's three more looks from the same suitcase. The silk scarf and tan crossbody are the finishers — there's always something knotted somewhere on a Parisian. Now tell me: what's the single dressiest thing on your calendar? That's the only outfit I want to plan deliberately; the rest can be happy improvisation.",
      reasoning:
        "Six core pieces plus two toppers is a full week from a carry-on, and because it's all in your palette everything mixes without thinking. I'm being bossy about packing light on purpose — you'll walk miles there, and a heavy bag turns a dream trip into a chore. The one heel plus flats combo covers restaurants and cobblestones both.",
      outfits: [OUTFIT.parisDay, OUTFIT.parisNight],
      shopping: [SHOP.boots],
    },
  },
  {
    keywords: [
      'expensive', 'look expensive', 'quiet luxury', 'luxe', 'rich',
      'elevated', 'without buying', 'without spending', 'shop my closet',
      'nothing new', 'already own',
    ],
    reply: {
      text: "Oh, this is my whole philosophy — and no, you don't need to buy a thing. You already own the formula: chocolate turtleneck, ecru trousers, camel coat over the top, tan knee-high boots. All warm neutrals, all tailored, nothing shiny. Now the hard part, and I know you won't love it — leave the statement jewelry in the drawer. I've seen you reach for the big earrings when you want to feel done, but here they'd undo the whole effect. Restraint is the flex. Where are you wearing this? If it's work I'll tuck the turtleneck; if it's dinner I'll leave it loose and softer.",
      transcript:
        "Here's my whole philosophy in one look — and the best part is looking expensive has almost nothing to do with spending. It's restraint and tone. You own the entire formula: chocolate turtleneck tucked into the ecru straight trousers, camel coat over the top, tan knee-high boots. Head-to-toe warm neutrals, everything tailored, nothing logo'd. Now I'm going to gently fight you on one thing — I know your instinct when you want to feel polished is to add a bold earring or a chunky necklace, but not today. Keep it to the fine gold hoops, because the money-look lives in what you leave off, not what you pile on. The real tell is fit: everything sitting clean at the shoulder and the ankle. Money is loud; taste is quiet. Tell me the occasion and I'll adjust how relaxed we let it read.",
      reasoning:
        "Tonal dressing in one colour family reads as considered and costly, full stop. I'm pushing back on the statement jewelry because it's the exact move that breaks the spell — the whole point of quiet luxury is that nothing shouts, and one loud piece makes the eye go 'trying,' which is the opposite of what you asked for.",
      outfits: [OUTFIT.quietLuxury],
    },
  },
  {
    keywords: ['dinner', 'date', 'evening', 'night out', 'restaurant', 'drinks'],
    reply: {
      text: "Ooh, dinner. Let's make it an occasion without looking like you tried too hard. I keep coming back to your rose slip dress — you wore it to that September dinner and told me you felt like yourself in it, which is the whole game. Camel coat draped over the shoulders, and let the silk do the talking. Quick question so I get it right: candlelit and romantic, or loud and fun? And is it chilly out — if so the coat stays on as part of the look rather than checked at the door.",
      transcript:
        "Ooh, dinner — I love a dinner. Let's make it feel like an occasion without the try-hard energy. I keep coming back to your rose slip dress, and not at random: you wore it to that dinner back in September and came home saying you felt completely like yourself. That's exactly what I want to recreate. Camel coat draped over the shoulders for structure, nude heels, and genuinely nothing else fussy — a whisper of gold at the ear and stop. The nicest part is you own every piece, so this costs you nothing but the decision. Two things I need from you: is this candlelit-and-romantic or lively-and-fun, because I'd style the hair and the lip differently, and what's it doing outside — if it's cold, the coat becomes part of the outfit instead of something you abandon at coat-check.",
      reasoning:
        "I'm not guessing with the slip dress — you've worn it before and it landed, and I trust a proven win over a clever new idea for a night that matters. The camel coat adds enough structure that soft doesn't tip into underdressed, and the rose tone is genuinely kind to your colouring under low light.",
      outfits: [OUTFIT.evening],
      shopping: [SHOP.hoops],
    },
  },
  {
    keywords: ['beige trouser', 'wide-leg', 'wide leg', 'trousers', 'pants', 'goes with'],
    reply: {
      text: "Your beige wide-legs are the hardest-working thing you own — honestly the best money you've spent, you reach for them constantly and it shows. For day: tuck in the cream cashmere, white sneakers, done — relaxed but pulled together. To dress them up later, swap to the rose silk blouse and nude heels and it's a completely different mood. One rule though — always tuck. I know you like them loose and untucked, but that hides the high waist and cuts your line in half. What are you dressing them for today, running around or something nicer?",
      transcript:
        "Your beige wide-leg trousers are the hardest-working thing in your closet — I genuinely love them on you, and you clearly agree because they're in half your recent looks. For day, tuck in the cream cashmere and add the white sneakers; relaxed but intentional. To take them out at night, swap the rose silk blouse in and the nude heels on, and you've got two entirely different moods from one pair of trousers. Here's the one place I'll be firm: tuck the top, always, even just the front. I've noticed you like leaving things loose and untucked because it feels easy, but on a high waist like these that trick hides the best part and shortens you — a half-tuck fixes it in two seconds. So what's the occasion — errands and coffee, or something you want to look done for?",
      reasoning:
        "The tuck isn't a style preference, it's the whole reason these trousers work — it shows the high waist and adds visual length, and I'll nudge you on it every time because untucked quietly undoes them. Keeping it tonal, cream on beige, is what tips the look from fine to expensive.",
      outfits: [OUTFIT.morning, OUTFIT.evening],
    },
  },
  {
    keywords: ['lisbon', 'trip', 'travel', 'vacation', 'holiday', 'pack'],
    reply: {
      text: "Lisbon, how lovely. Warm days, cool evenings, and those hills — so I'm packing to mix and re-mix, not single-use outfits. Linen shirt and peach shorts for daytime, the floral midi for a long lunch by the water, the slip dress for one nice dinner, everything layering under the trench when the breeze picks up. And I'll say it plainly: leave the heels home. Lisbon is cobblestones and inclines, they'll ruin your evening and probably a heel. How many nights are you there, and is any of it fancy? That tells me whether one dressy look is enough or we need two.",
      transcript:
        "Lisbon, how lovely — one of my favourite cities to dress for. Warm days, genuinely cool evenings, and a lot of walking on those famous hills, so I'm packing pieces that mix and re-mix rather than a fresh outfit per day. Linen shirt and peach shorts for daytime, the floral midi for a long lunch by the water, and the slip dress for one really good dinner. Everything layers under the trench when the wind comes off the river. Here's my firm opinion for this trip: no heels. I know they feel like the 'nice dinner' move, but Lisbon's cobbles and slopes are unforgiving and you'll spend the night miserable — a flat sandal or a low block does the job and saves your feet for the walk home. Tell me how many nights you've got and whether anything's properly dressy, and I'll decide if one evening look covers it or we build a second.",
      reasoning:
        "A five-piece capsule gives you eight or nine outfits, exactly right when you're on your feet all day and packing light. And I'm overruling the heels on purpose — the terrain there punishes them, and comfort is what lets you actually enjoy a place instead of counting the blocks back to the hotel.",
      outfits: [OUTFIT.casual, OUTFIT.evening],
      shopping: [SHOP.boots, SHOP.tote],
    },
  },
  {
    keywords: ['cozy', 'cosy', 'home', 'wfh', 'working from home', 'comfortable', 'relax', 'lazy'],
    reply: {
      text: "A soft day at home — honestly my favourite thing to style, because what you wear when no one's watching changes how the whole day feels. Cream cashmere, wide-leg trousers, sleeves pushed up, feet bare. Here's my one push: I'd keep you out of actual sweats. Not because there's anything wrong with them, but you always tell me you feel more like yourself when you're a notch above lounging, and it shows in how you move. Keep a blazer on the back of the chair and you're camera-ready from the waist up in one second. Are you working today, or is this a genuine day off? I'll dial the polish accordingly.",
      transcript:
        "A soft day at home — my favourite kind of styling, honestly, because what you wear with no audience quietly sets the tone for everything. Cream cashmere with the wide-leg trousers, sleeves pushed up, feet bare — comfortable but still unmistakably you. If a video call ambushes you, a blazer over the top makes you presentable from the waist up instantly. One gentle opinion: I'd steer you away from full sweats today. You've told me more than once that you feel sharper and more like yourself when you're just a step above loungewear, and I believe you — soft tailoring gives you the comfort without the slump. So tell me, are we working or genuinely off the clock? On a real day off I'll relax it further; if you're working I'll keep a little structure so your brain stays in gear.",
      reasoning:
        "You've said it yourself — you feel better and get more done when you're a notch above pyjamas, so I'm holding you to that rather than defaulting to sweats. Soft tailoring keeps the comfort, and the blazer-on-the-chair trick means a surprise call never catches you out.",
      outfits: [OUTFIT.morning],
      shopping: [SHOP.blazer],
    },
  },
]

// Vibe-driven directions. `base` is the standalone reply; when the user is
// pushing back, we prepend an acknowledgement instead of repeating the intro.
interface VibeReply {
  keywords: string[]
  base: string
  pivot: string
  transcript: string
  reasoning: string
  outfits: Outfit[]
  shopping?: ShopItem[]
}

const VIBES: VibeReply[] = [
  {
    keywords: [
      'edgy', 'edgier', 'cool', 'cooler', 'sharp', 'sharper', 'structured',
      'modern', 'sleek', 'minimal', 'minimalist', 'tough', 'tougher', 'crisp',
      'tailored', 'clean lines', 'androgynous',
    ],
    base: "Let's sharpen things up. I'm pulling the structured cream blazer over straight ecru trousers with the pointed ankle boots — cooler, more architectural, a little more you-mean-business. Same soft palette, but the lines do the talking now.",
    pivot: "Got it — less soft, more sharp. Let's swap the romance for something architectural: the structured cream blazer over straight ecru trousers with the pointed ankle boots. Cooler, cleaner, a little more you-mean-business — same palette, harder edges.",
    transcript:
      "Less soft, more sharp — I hear you. Let's swap the romance out for something architectural: the structured cream blazer over straight ecru trousers with the pointed ankle boots. It's cooler and cleaner, a little more you-mean-business, but I'm keeping it in your palette so it still feels unmistakably yours. The boots are the key — they give the whole thing an edge a heel never would.",
    reasoning:
      "Structure and straight lines read as confidence. Keeping it tonal in cream and taupe means the sharpness comes from the silhouette, not from adding louder colour.",
    outfits: [OUTFIT.sharp],
    shopping: [SHOP.boots],
  },
  {
    keywords: [
      'playful', 'fun', 'bold', 'bolder', 'bright', 'brighter', 'colour',
      'color', 'colourful', 'colorful', 'statement', 'expressive', 'happy',
      'flirty', 'joyful', 'daring',
    ],
    base: "Okay, let's have some fun with it. The peach floral midi with a coral cardigan thrown over, straw tote, and a little stack of gold — it's breezy and expressive without shouting. The kind of outfit that makes people smile at you.",
    pivot: "Fair — that was playing it safe. Let's turn the dial up: the peach floral midi with a coral cardigan over the shoulders, the straw tote, a little stack of gold. Breezy, expressive, a bit flirty — the kind of outfit that makes people smile at you.",
    transcript:
      "You want more personality — I love that. Let's turn the dial up: the peach floral midi with the coral cardigan thrown over your shoulders, the straw tote, and a little stack of gold bracelets. It's breezy and expressive without ever shouting, which is the sweet spot for you. The coral is the moment of colour; everything else stays soft so it feels considered, not costume.",
    reasoning:
      "One deliberate pop of coral against your peach-and-cream base adds joy without breaking the palette — it reads intentional rather than loud.",
    outfits: [OUTFIT.playful],
    shopping: [SHOP.scarf],
  },
  {
    keywords: [
      'soft', 'softer', 'romantic', 'feminine', 'pretty', 'delicate',
      'dreamy', 'gentle', 'elegant', 'graceful',
    ],
    base: "Then let's lean all the way into soft. The rose slip dress with the camel coat over your shoulders — fluid, warm, quietly romantic. It moves beautifully and needs almost nothing else.",
    pivot: "Softer — yes, let's go there. The rose slip dress with the camel coat draped over your shoulders: fluid, warm, quietly romantic. It moves beautifully and needs almost nothing else, which is exactly the point.",
    transcript:
      "Softer it is — and honestly this is where you shine. The rose slip dress with the camel coat draped over your shoulders is fluid, warm, and quietly romantic. It moves beautifully when you walk and it needs almost nothing else — a whisper of gold at the ear and you're done. Let the silk be the whole story.",
    reasoning:
      "Bias-cut silk and a relaxed coat create softness through movement and drape rather than detail, which always feels more elegant than anything fussy.",
    outfits: [OUTFIT.evening],
    shopping: [SHOP.hoops],
  },
  {
    keywords: [
      'casual', 'relaxed', 'easy', 'easier', 'laid-back', 'laid back', 'chill',
      'comfier', 'comfy', 'dressed down', 'dress down', 'low-key', 'low key',
      'effortless',
    ],
    base: "Let's take the pressure off entirely. The linen shirt with the peach shorts and the straw tote — easy, sunlit, nothing you have to think about. Roll the sleeves and you're out the door.",
    pivot: "Totally — let's take the pressure off. The linen shirt with the peach shorts and the straw tote: easy, sunlit, nothing you have to think about. Roll the sleeves, grab the tote, out the door. Relaxed but still put-together, never sloppy.",
    transcript:
      "Let's take the pressure right off. The linen shirt with the peach shorts and the straw tote is easy and sunlit — nothing you have to think about. Roll the sleeves once, tuck the front of the shirt so it still has a little shape, grab the tote, and you're out the door. Relaxed but never sloppy; that half-tuck is doing quiet work.",
    reasoning:
      "Breathable linen and a loose fit keep it genuinely comfortable, while a single half-tuck stops relaxed from tipping into careless.",
    outfits: [OUTFIT.casual],
  },
  {
    keywords: [
      'dressy', 'dressier', 'formal', 'fancy', 'fancier', 'elevated',
      'polished', 'glamorous', 'glam', 'special', 'occasion', 'event',
    ],
    base: "Let's elevate the whole thing. Rose silk blouse tucked into the wide-leg trousers, nude heels, the camel coat over the top — it's polished and grown-up, the kind of look that feels expensive because everything is tonal and tailored.",
    pivot: "More polished — absolutely. Rose silk blouse tucked into the wide-leg trousers, nude heels, camel coat over the top. It's grown-up and quietly expensive, all tonal and tailored — a real step up from where we started.",
    transcript:
      "Let's elevate the whole thing. The rose silk blouse tucked into the wide-leg trousers with the nude heels, and the camel coat over the top for the walk in. It's polished and grown-up — the kind of look that reads expensive precisely because everything is tonal and tailored rather than flashy. Fully tucked, one delicate earring, and you're the most put-together person in the room.",
    reasoning:
      "Silk, a clean trouser line, and a heel are the three levers that turn everyday pieces formal — and keeping it all in one colour family is what makes it feel considered.",
    outfits: [OUTFIT.evening, OUTFIT.morning],
    shopping: [SHOP.hoops],
  },
]

// Whole-word pushback signals (matched on word boundaries so "no" doesn't
// fire on "another" or "know").
const PUSHBACK_WORDS = [
  'no', 'not', "don't", 'dont', 'nope', 'nah', 'meh', 'hate', 'dislike',
  'boring', 'else', 'different', 'instead', 'rather', 'change', 'other',
  'too', 'again', 'another', 'switch', 'swap', 'without', 'skip',
  'actually', 'prefer', 'bored',
]
// Phrases that are safe to match anywhere.
const PUSHBACK_PHRASES = ['over it', 'not really', 'not sure', 'not feeling']

// Specific pieces the user might want to steer away from.
const PIECES = [
  'slip dress', 'slip', 'dress', 'coat', 'trench', 'trousers', 'pants',
  'sneakers', 'heels', 'cashmere', 'sweater', 'blouse', 'shorts', 'blazer',
  'espadrilles',
]

// Explicit shopping requests — lead with pieces to buy, not closet outfits.
const SHOPPING_KEYWORDS = [
  'shop', 'shopping', 'buy', 'purchase', 'invest', 'wishlist', 'wish list',
  'splurge', 'order', 'store', 'add to my closet', 'add to closet',
  'missing', 'need to get', 'what should i get', 'new pieces', 'new piece',
  'fill the gap', 'fill a gap', 'gaps', 'gift', 'treat myself',
]

// When the user explicitly wants to NOT shop, these override shopping detection
// (e.g. "look expensive without buying anything", "shop my own closet").
const NO_BUY_PHRASES = [
  'without buying', 'without spending', "don't buy", 'dont buy',
  "don't want to buy", 'not buying', 'no shopping', 'without shopping',
  "can't afford", 'nothing new', 'already own', 'shop my closet',
  'shop my own closet', 'not spend', 'no new', 'without new',
]

const SHOPPING_REPLY: MuseReply = {
  text: "Happy to play personal shopper — but I'm going to be the honest kind, not the kind that just says yes. Looking at what you already own, you don't need much, and I'd rather you buy four things that multiply everything than fourteen that sit there. Start here: fine gold hoops, a relaxed cream blazer, leather ankle boots, and a silk scarf. Every one pairs with things you already wear. What's the budget you're actually comfortable with? I'll tell you which of these to get first and which can wait.",
  transcript:
    "Happy to play personal shopper — genuinely one of my favourite things — but I'll be the honest friend, not the enabler. The good news from your closet is that you don't have a gap problem, you have a connector problem, so we buy carefully. Four pieces, in order: fine gold hoops to warm up your evening looks, a relaxed cream blazer to throw over the cashmere and turn loungewear into an outfit, leather ankle boots for that in-between when heels are too much and sneakers too little, and a silk scarf to bridge your rose and peach pieces. Here's what I'll talk you out of — the trend stuff and the 'it's on sale' impulse buys, because you already have a closet full of proof that the quiet, useful pieces are the ones you actually wear. Tell me your comfortable number and I'll rank these so you can start with the one that earns its keep fastest.",
  reasoning:
    "These aren't new outfits, they're multipliers — metal, structure, an in-between shoe, and a colour connector — each one unlocking several combinations from clothes you own. I'm deliberately keeping the list short and trend-free because your buying history says the restrained pieces get worn and the exciting ones don't.",
  shopping: [SHOP.hoops, SHOP.blazer, SHOP.boots, SHOP.scarf],
}

const DEFAULT_REPLY: MuseReply = {
  text: "Okay, let me start you somewhere. Going off what you've actually reached for lately and the warm weather today, I pulled a few from your own closet — the rose slip and camel coat if the day turns into something, the cashmere set for your easy daytime default. But I'm half-guessing until you tell me more. Where are you headed, and just as important — how do you want to feel today? Powerful, invisible, pretty, comfortable? Give me that and I'll stop hedging and actually commit.",
  transcript:
    "Okay, let me give you a starting point rather than a blank stare. Based on the pieces you've genuinely been reaching for lately and today's warm weather, I pulled a few looks straight from your closet — nothing here needs buying. The rose slip with the camel coat is effortless if the evening becomes an occasion, and the cashmere-and-wide-leg set is your reliable daytime win. But I'll be honest, these are safe because I don't have the plot yet. Tell me where you're going, or even better, how you want to feel when you walk in — I style completely differently for 'I want to disappear' versus 'I want the room to notice.' Give me the feeling and I'll commit hard instead of playing it safe.",
  reasoning:
    "These are built entirely from pieces you already own and wear well together, so they're flattering, low-risk starting points — but I'm intentionally not over-committing yet. The best styling comes from knowing the occasion and the mood, so I'd rather show you something safe and ask than guess boldly and get it wrong.",
  outfits: [OUTFIT.morning, OUTFIT.evening, OUTFIT.casual],
}

export interface ReplyContext {
  // Whether Muse has already responded at least once in this session.
  hasPriorReply?: boolean
}

function detectShopping(lower: string): boolean {
  return SHOPPING_KEYWORDS.some((kw) => lower.includes(kw))
}

function detectVibe(lower: string): VibeReply | undefined {
  return VIBES.find((v) => v.keywords.some((kw) => lower.includes(kw)))
}

function detectPushback(lower: string): boolean {
  if (PUSHBACK_PHRASES.some((p) => lower.includes(p))) return true
  const words = lower.split(/[^a-z']+/).filter(Boolean)
  return words.some((w) => PUSHBACK_WORDS.includes(w))
}

function detectRejectedPiece(lower: string): string | undefined {
  return PIECES.find((p) => lower.includes(p))
}

// When the user pushes back but names no vibe, offer a genuinely different
// direction and invite them to steer, instead of repeating safe looks.
function pivotReply(rejectedPiece?: string): MuseReply {
  if (rejectedPiece) {
    return {
      text: `Not the ${rejectedPiece} — noted, and honestly good instinct. Let's go a different direction entirely: the structured blazer over straight trousers with the ankle boots. Cooler and cleaner. If that's not the mood either, tell me — softer, bolder, dressier, more relaxed? I'll follow your lead.`,
      transcript: `Not the ${rejectedPiece} — noted, and honestly a good instinct if it's not feeling right today. Let's leave it out completely and go a different direction: the structured blazer over straight trousers with the pointed ankle boots. It's cooler and cleaner, nothing like what I first showed you. And if that's still not the mood, just tell me the feeling you're chasing — softer, bolder, dressier, more relaxed — and I'll rebuild around it. This is your call; I'm just here to make it easy.`,
      reasoning:
        "You told me what you don't want, which is just as useful as what you do. Pivoting to a sharper silhouette gives you a real alternative rather than a small tweak on the same idea.",
      outfits: [OUTFIT.sharp],
      shopping: [SHOP.boots],
    }
  }
  return {
    text: "Totally fair — that one didn't land, and that's useful to know. Let's change lanes: here's something sharper and more architectural instead. But I'd rather nail it than guess — what are you feeling? Softer and romantic, bolder and playful, dressier, or easier and more relaxed?",
    transcript:
      "Totally fair — that one didn't land, and honestly that's useful to know. Let's change lanes completely: here's something sharper and more architectural, a real departure from where we started. But I'd rather nail it than keep guessing, so point me somewhere — do you want softer and romantic, bolder and playful, dressier and elevated, or easier and more relaxed? Give me the feeling and I'll build the whole thing around it.",
    reasoning:
      "A vague pushback usually means the mood is off, not the individual pieces — so I'm offering a clearly different silhouette and asking for direction rather than nudging the same look.",
    outfits: [OUTFIT.sharp],
  }
}

export function getMuseReply(input: string, context: ReplyContext = {}): MuseReply {
  const lower = input.toLowerCase()
  const vibe = detectVibe(lower)
  const isPushback = detectPushback(lower)

  // 0. Explicit shopping request without a named vibe — lead with pieces to buy.
  //    (If a vibe is also named, e.g. "buy something edgier", the vibe branch
  //    below already surfaces a matching shopping suggestion.)
  //    Skip entirely when the user explicitly does NOT want to buy anything.
  const avoidBuying = NO_BUY_PHRASES.some((p) => lower.includes(p))
  if (detectShopping(lower) && !vibe && !avoidBuying) {
    return SHOPPING_REPLY
  }

  // 1. A vibe is named (e.g. "something edgier", "can we go softer?").
  //    Use the pivot phrasing when it's a correction, the base phrasing when fresh.
  if (vibe) {
    const usePivot = isPushback || context.hasPriorReply
    return {
      text: usePivot ? vibe.pivot : vibe.base,
      transcript: vibe.transcript,
      reasoning: vibe.reasoning,
      outfits: vibe.outfits,
      shopping: vibe.shopping,
    }
  }

  // 2. Pushback without a named vibe — acknowledge and offer a real alternative.
  if (isPushback && context.hasPriorReply) {
    return pivotReply(detectRejectedPiece(lower))
  }

  // 3. Occasion intents (dinner, trip, cozy day, etc.).
  const match = INTENTS.find((intent) =>
    intent.keywords.some((kw) => lower.includes(kw)),
  )
  if (match) return match.reply

  return DEFAULT_REPLY
}
