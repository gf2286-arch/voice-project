'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, Search, Shirt, X, LayoutGrid, Aperture } from 'lucide-react'
import { ClosetItemCard, type ClosetItem } from '@/components/muse/closet-item-card'
import { ClosetItemDetail } from '@/components/muse/closet-item-detail'
import { ComingSoonChip } from '@/components/muse/coming-soon-chip'

interface ClosetSection {
  id: string
  title: string
  description: string
  items: ClosetItem[]
}

const SECTIONS: ClosetSection[] = [
  {
    id: 'tops',
    title: 'Tops & Blouses',
    description: 'Shirts, tees & everyday layers',
    items: [
      {
        id: 'linen-shirt',
        name: 'White Linen Shirt',
        image: '/closet/linen-shirt.png',
        category: 'Shirt',
        color: 'White',
        colorSwatch: 'oklch(0.98 0.005 90)',
        season: 'Summer',
        tags: ['Breathable', 'Crisp', 'Versatile'],
        wornPhotos: ['/closet/worn/linen-shirt-worn.png'],
        lastWorn: {
          date: 'Oct 28',
          occasion: 'Coffee & a gallery afternoon',
          pairedWith: ['Vintage Straight Jeans', 'Tan Woven Espadrilles'],
        },
        museAdvice:
          "You wear this beautifully unbuttoned one extra notch — keep doing that. Layer it under the camel v-neck vest with the collar out for that Sunday-in-the-city look.",
      },
      {
        id: 'silk-blouse',
        name: 'Rose Silk Blouse',
        image: '/closet/silk-blouse.png',
        category: 'Blouse',
        color: 'Rose',
        colorSwatch: 'oklch(0.78 0.09 18)',
        season: 'All season',
        tags: ['Elegant', 'Evening', 'Silk'],
        wornPhotos: ['/closet/worn/silk-blouse-worn.png'],
        lastWorn: {
          date: 'Nov 4',
          occasion: 'Dinner reservation downtown',
          pairedWith: ['Beige Wide-Leg Trousers', 'Nude Strappy Heels'],
        },
        museAdvice:
          "The rose catches candlelight — it's a night blouse. Half-tuck it into the black cigarette trousers and let one shoulder drape. A slip of gold at the ear is all it needs.",
      },
      {
        id: 'black-tank',
        name: 'Black Ribbed Tank',
        image: '/closet/black-tank.png',
        category: 'Top',
        color: 'Black',
        colorSwatch: 'oklch(0.28 0.01 280)',
        season: 'All season',
        tags: ['Basic', 'Layerable', 'Fitted'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 10',
          occasion: 'Errands then drinks',
          pairedWith: ['Vintage Straight Jeans', 'Black Leather Moto Jacket'],
        },
        museAdvice:
          "The quiet workhorse of the whole closet. Tuck it into the leather midi skirt for evening, or throw the oatmeal cardigan over it for day — it makes everything look intentional.",
      },
      {
        id: 'breton-tee',
        name: 'Breton Striped Tee',
        image: '/closet/breton-tee.png',
        category: 'Top',
        color: 'Navy / Cream',
        colorSwatch: 'oklch(0.4 0.06 250)',
        season: 'All season',
        tags: ['Classic', 'French', 'Casual'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 2',
          occasion: 'Weekend market wander',
          pairedWith: ['Vintage Straight Jeans', 'Red Ballet Flats'],
        },
        museAdvice:
          "Peak off-duty French. Wear it with the vintage jeans and red ballet flats and you look effortless without trying. Tuck it into the cream pleated skirt when you want it a touch more polished.",
      },
      {
        id: 'silk-cami',
        name: 'Ivory Silk Camisole',
        image: '/closet/silk-cami.png',
        category: 'Top',
        color: 'Ivory',
        colorSwatch: 'oklch(0.95 0.015 90)',
        season: 'All season',
        tags: ['Delicate', 'Evening', 'Layerable'],
        wornPhotos: [],
        lastWorn: {
          date: 'Oct 22',
          occasion: 'Rooftop drinks',
          pairedWith: ['Black Leather Midi Skirt', 'Black Leather Moto Jacket'],
        },
        museAdvice:
          "This is your going-out secret weapon — silk skin under a sharp jacket. Wear it with the navy blazer for a dressed-up interview look, or the leather skirt after dark.",
      },
    ],
  },
  {
    id: 'knitwear',
    title: 'Knitwear',
    description: 'Sweaters, cardigans & cozy layers',
    items: [
      {
        id: 'cashmere-sweater',
        name: 'Cream Cashmere Sweater',
        image: '/closet/cashmere-sweater.png',
        category: 'Knitwear',
        color: 'Cream',
        colorSwatch: 'oklch(0.94 0.02 80)',
        season: 'Autumn',
        tags: ['Cozy', 'Soft', 'Layerable'],
        wornPhotos: ['/closet/worn/cashmere-sweater-worn.png'],
        lastWorn: {
          date: 'Nov 12',
          occasion: 'Sunday brunch with friends',
          pairedWith: ['Beige Wide-Leg Trousers', 'White Leather Sneakers'],
        },
        museAdvice:
          "Your comfort piece — let's make it intentional. Tuck the front hem into the wide-leg trousers and add the camel coat over the top. Cozy becomes considered.",
      },
      {
        id: 'brown-turtleneck',
        name: 'Chocolate Turtleneck',
        image: '/closet/brown-turtleneck.png',
        category: 'Knitwear',
        color: 'Chocolate',
        colorSwatch: 'oklch(0.42 0.05 55)',
        season: 'Winter',
        tags: ['Fine-knit', 'Rich', 'Tonal'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 7',
          occasion: 'Museum then wine',
          pairedWith: ['Ecru Straight Trousers', 'Tan Knee-High Boots'],
        },
        museAdvice:
          "Chocolate brown is the most underrated neutral you own. Keep it tonal with the ecru trousers and camel coat and you'll look quietly expensive — that's the whole trick.",
      },
      {
        id: 'oatmeal-cardigan',
        name: 'Oatmeal Chunky Cardigan',
        image: '/closet/oatmeal-cardigan.png',
        category: 'Cardigan',
        color: 'Oatmeal',
        colorSwatch: 'oklch(0.88 0.02 75)',
        season: 'Autumn',
        tags: ['Chunky', 'Cozy', 'Relaxed'],
        wornPhotos: [],
        lastWorn: {
          date: 'Oct 30',
          occasion: 'Working from a cafe',
          pairedWith: ['Black Ribbed Tank', 'Vintage Straight Jeans'],
        },
        museAdvice:
          "Throw it over the black tank and jeans for the easiest day look, or belt it over the slip dress for something unexpected. The bulk balances a narrow bottom beautifully.",
      },
      {
        id: 'camel-cardigan',
        name: 'Camel Fine Cardigan',
        image: '/shop/eval-cardigan.png',
        category: 'Cardigan',
        color: 'Camel',
        colorSwatch: 'oklch(0.75 0.05 68)',
        season: 'All season',
        tags: ['Fine-knit', 'Buttoned', 'Versatile'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 1',
          occasion: 'Lunch with mum',
          pairedWith: ['Cream Pleated Skirt', 'Red Ballet Flats'],
        },
        museAdvice:
          "Button it all the way and wear it as a top — that's the chic way. It layers under the trench and picks up the camel coat perfectly for a head-to-toe warm-neutral moment.",
      },
    ],
  },
  {
    id: 'dresses',
    title: 'Dresses',
    description: 'Slips, midis & everything between',
    items: [
      {
        id: 'slip-dress',
        name: 'Rose Silk Slip Dress',
        image: '/closet/slip-dress.png',
        category: 'Dress',
        color: 'Rose',
        colorSwatch: 'oklch(0.74 0.1 18)',
        season: 'Summer',
        tags: ['Evening', 'Bias-cut', 'Romantic'],
        wornPhotos: ['/closet/worn/slip-dress-worn.png'],
        lastWorn: {
          date: 'Sep 30',
          occasion: 'Rooftop birthday dinner',
          pairedWith: ['Nude Strappy Heels', 'Camel Wool Coat'],
        },
        museAdvice:
          "A golden-hour dress — the bias cut moves with you. Layer the black moto jacket over it to toughen it up, or the camel coat to keep it soft. Both work.",
      },
      {
        id: 'floral-dress',
        name: 'Peach Floral Midi',
        image: '/closet/floral-dress.png',
        category: 'Dress',
        color: 'Peach',
        colorSwatch: 'oklch(0.85 0.06 52)',
        season: 'Summer',
        tags: ['Daytime', 'Floral', 'Flowy'],
        wornPhotos: ['/closet/worn/floral-dress-worn.png'],
        lastWorn: {
          date: 'Aug 18',
          occasion: 'Garden lunch',
          pairedWith: ['Tan Woven Espadrilles', 'Woven Straw Tote'],
        },
        museAdvice:
          "Add the trench belted at the waist and swap espadrilles for ballet flats to take it into autumn. Same dress, entirely new mood.",
      },
      {
        id: 'black-midi',
        name: 'Black Column Midi',
        image: '/closet/black-midi.png',
        category: 'Dress',
        color: 'Black',
        colorSwatch: 'oklch(0.28 0.01 280)',
        season: 'All season',
        tags: ['Evening', 'Minimal', 'Elegant'],
        wornPhotos: [],
        lastWorn: {
          date: 'Oct 12',
          occasion: 'Opera night',
          pairedWith: ['Nude Strappy Heels', 'Camel Wool Coat'],
        },
        museAdvice:
          "The little black dress that does everything. Gold hoops and heels for dinner; the moto jacket and loafers to make it cool and downtown. Never overthink it.",
      },
      {
        id: 'broderie-sundress',
        name: 'Broderie Sundress',
        image: '/closet/broderie-sundress.png',
        category: 'Dress',
        color: 'White',
        colorSwatch: 'oklch(0.97 0.005 90)',
        season: 'Summer',
        tags: ['Daytime', 'Eyelet', 'Romantic'],
        wornPhotos: [],
        lastWorn: {
          date: 'Aug 5',
          occasion: 'Seaside weekend',
          pairedWith: ['Tan Woven Espadrilles', 'Woven Straw Tote'],
        },
        museAdvice:
          "Pure summer-in-Spain. Wear it alone with espadrilles by day, then throw the suede shearling jacket over it when the evening cools. The white against tan suede is gorgeous.",
      },
      {
        id: 'polka-wrap-dress',
        name: 'Red Polka Dot Wrap Dress',
        image: '/closet/polka-wrap-dress.png',
        category: 'Dress',
        color: 'Red',
        colorSwatch: 'oklch(0.55 0.16 25)',
        season: 'All season',
        tags: ['Playful', 'Wrap', 'Statement'],
        wornPhotos: [],
        lastWorn: {
          date: 'Sep 14',
          occasion: 'Friend\u2019s engagement party',
          pairedWith: ['Nude Strappy Heels', 'Black Leather Moto Jacket'],
        },
        museAdvice:
          "The wrap flatters everyone — it's doing quiet work at the waist. Let it be the star: nude heels, small bag, one bracelet. The red ballet flats are a fun daytime swap.",
      },
      {
        id: 'olive-shirt-dress',
        name: 'Olive Linen Shirt Dress',
        image: '/closet/olive-shirt-dress.png',
        category: 'Dress',
        color: 'Olive',
        colorSwatch: 'oklch(0.58 0.06 120)',
        season: 'Summer',
        tags: ['Daytime', 'Utility', 'Relaxed'],
        wornPhotos: [],
        lastWorn: {
          date: 'Jul 29',
          occasion: 'City walk',
          pairedWith: ['White Leather Sneakers', 'Tan Leather Crossbody'],
        },
        museAdvice:
          "Belt it hard at the waist or leave it loose over the black tank as a duster — two dresses in one. Olive loves the tan leather accessories you already own.",
      },
    ],
  },
  {
    id: 'pants',
    title: 'Pants & Denim',
    description: 'Trousers, jeans & tailored bottoms',
    items: [
      {
        id: 'wide-trousers',
        name: 'Beige Wide-Leg Trousers',
        image: '/closet/wide-trousers.png',
        category: 'Trousers',
        color: 'Beige',
        colorSwatch: 'oklch(0.87 0.03 75)',
        season: 'All season',
        tags: ['Tailored', 'Flowy', 'Workwear'],
        wornPhotos: ['/closet/worn/wide-trousers-worn.png'],
        lastWorn: {
          date: 'Nov 4',
          occasion: 'Dinner reservation downtown',
          pairedWith: ['Rose Silk Blouse', 'Nude Strappy Heels'],
        },
        museAdvice:
          "These do the heavy lifting. Always tuck the top and pair with a heel or pointed flat to lengthen the line. Cream on beige is what makes them look expensive.",
      },
      {
        id: 'linen-shorts',
        name: 'Peach Linen Shorts',
        image: '/closet/linen-shorts.png',
        category: 'Shorts',
        color: 'Peach',
        colorSwatch: 'oklch(0.86 0.07 55)',
        season: 'Summer',
        tags: ['High-waisted', 'Relaxed', 'Vacation'],
        wornPhotos: ['/closet/worn/linen-shorts-worn.png'],
        lastWorn: {
          date: 'Oct 28',
          occasion: 'Coffee & a gallery afternoon',
          pairedWith: ['White Linen Shirt', 'Tan Woven Espadrilles'],
        },
        museAdvice:
          "Tuck into the high waist fully to show the line. Knot the rose blouse at the waist and grab the straw tote — effortless, and it photographs beautifully.",
      },
      {
        id: 'vintage-jeans',
        name: 'Vintage Straight Jeans',
        image: '/closet/vintage-jeans.png',
        category: 'Denim',
        color: 'Mid Blue',
        colorSwatch: 'oklch(0.55 0.07 250)',
        season: 'All season',
        tags: ['Straight-leg', 'Everyday', 'Denim'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 11',
          occasion: 'Gallery opening',
          pairedWith: ['Breton Striped Tee', 'Black Leather Moto Jacket'],
        },
        museAdvice:
          "Your everyday hero. Cuff them once above the loafers, tuck in the Breton, and add the trench — that's the uniform. Dress them up with heels and the silk cami at night.",
      },
      {
        id: 'black-trousers',
        name: 'Black Cigarette Trousers',
        image: '/closet/black-trousers.png',
        category: 'Trousers',
        color: 'Black',
        colorSwatch: 'oklch(0.28 0.01 280)',
        season: 'All season',
        tags: ['Tailored', 'Sharp', 'Workwear'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 6',
          occasion: 'Client meeting',
          pairedWith: ['Rose Silk Blouse', 'Black Leather Loafers'],
        },
        museAdvice:
          "The sharpest line in your closet. Ankle-skimming, so always wear with a loafer or heel. Pair with the navy blazer and silk cami for a look that means business.",
      },
      {
        id: 'ecru-trousers',
        name: 'Ecru Straight Trousers',
        image: '/closet/ecru-trousers.png',
        category: 'Trousers',
        color: 'Ecru',
        colorSwatch: 'oklch(0.9 0.02 85)',
        season: 'All season',
        tags: ['Tailored', 'Straight', 'Neutral'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 7',
          occasion: 'Museum then wine',
          pairedWith: ['Chocolate Turtleneck', 'Tan Knee-High Boots'],
        },
        museAdvice:
          "The backbone of every quiet-luxury look you own. Keep everything tonal on top — chocolate, camel, cream — and let the tailoring speak.",
      },
    ],
  },
  {
    id: 'skirts',
    title: 'Skirts',
    description: 'Leather, pleats & denim',
    items: [
      {
        id: 'leather-skirt',
        name: 'Black Leather Midi Skirt',
        image: '/closet/leather-skirt.png',
        category: 'Skirt',
        color: 'Black',
        colorSwatch: 'oklch(0.26 0.01 280)',
        season: 'All season',
        tags: ['Edgy', 'Evening', 'Statement'],
        wornPhotos: [],
        lastWorn: {
          date: 'Oct 22',
          occasion: 'Rooftop drinks in SoHo',
          pairedWith: ['Ivory Silk Camisole', 'Black Leather Moto Jacket'],
        },
        museAdvice:
          "The coolest thing you own. Silk cami and heels for a night out, or the Breton tee and loafers to dress it down. The contrast of soft-and-tough is the whole point.",
      },
      {
        id: 'pleated-skirt',
        name: 'Cream Pleated Skirt',
        image: '/closet/pleated-skirt.png',
        category: 'Skirt',
        color: 'Cream',
        colorSwatch: 'oklch(0.93 0.02 82)',
        season: 'All season',
        tags: ['Elegant', 'Fluid', 'Feminine'],
        wornPhotos: [],
        lastWorn: {
          date: 'Sep 20',
          occasion: 'Lunch then shopping',
          pairedWith: ['Camel Fine Cardigan', 'Red Ballet Flats'],
        },
        museAdvice:
          "The movement does the work — keep the top tucked and simple. Camel cardigan and ballet flats for day; silk cami and heels to make it evening.",
      },
      {
        id: 'denim-mini',
        name: 'Denim Mini Skirt',
        image: '/closet/denim-mini.png',
        category: 'Skirt',
        color: 'Light Blue',
        colorSwatch: 'oklch(0.72 0.05 245)',
        season: 'Summer',
        tags: ['Casual', 'Youthful', 'Denim'],
        wornPhotos: [],
        lastWorn: {
          date: 'Aug 24',
          occasion: 'Festival afternoon',
          pairedWith: ['Black Ribbed Tank', 'White Leather Sneakers'],
        },
        museAdvice:
          "Keep it simple up top so it doesn't read too young — the black tank and white sneakers are perfect. Add the suede shearling jacket for that festival-in-Spain energy.",
      },
    ],
  },
  {
    id: 'outerwear',
    title: 'Outerwear',
    description: 'Coats, blazers & jackets',
    items: [
      {
        id: 'camel-coat',
        name: 'Camel Wool Coat',
        image: '/closet/camel-coat.png',
        category: 'Coat',
        color: 'Camel',
        colorSwatch: 'oklch(0.7 0.06 65)',
        season: 'Winter',
        tags: ['Warm', 'Timeless', 'Wool'],
        wornPhotos: ['/closet/worn/camel-coat-worn.png'],
        lastWorn: {
          date: 'Nov 9',
          occasion: 'Weekend in the city',
          pairedWith: ['Chocolate Turtleneck', 'Ecru Straight Trousers'],
        },
        museAdvice:
          "This coat elevates anything underneath, so keep the base tonal. Leave it open with a loose belt for that off-duty drape — it's the most expensive-looking piece you own.",
      },
      {
        id: 'trench-coat',
        name: 'Classic Beige Trench',
        image: '/closet/trench-coat.png',
        category: 'Coat',
        color: 'Beige',
        colorSwatch: 'oklch(0.86 0.03 72)',
        season: 'Spring',
        tags: ['Classic', 'Rainproof', 'Belted'],
        wornPhotos: ['/closet/worn/trench-coat-worn.png'],
        lastWorn: {
          date: 'Oct 15',
          occasion: 'Rainy commute & errands',
          pairedWith: ['Breton Striped Tee', 'Vintage Straight Jeans'],
        },
        museAdvice:
          "Belt it rather than button it and it instantly shapes the waist. Over the Breton and jeans it's peak Parisian; over the floral midi it's unexpected and lovely.",
      },
      {
        id: 'moto-jacket',
        name: 'Black Leather Moto Jacket',
        image: '/shop/eval-moto-jacket.png',
        category: 'Jacket',
        color: 'Black',
        colorSwatch: 'oklch(0.26 0.01 280)',
        season: 'All season',
        tags: ['Edgy', 'Leather', 'Cool'],
        wornPhotos: [],
        lastWorn: {
          date: 'Oct 22',
          occasion: 'Rooftop drinks in SoHo',
          pairedWith: ['Ivory Silk Camisole', 'Black Leather Midi Skirt'],
        },
        museAdvice:
          "The great equalizer — it toughens anything soft. Over the slip dress or the floral midi it turns pretty into cool. This is what makes an outfit feel downtown.",
      },
      {
        id: 'linen-blazer',
        name: 'Ecru Linen Blazer',
        image: '/shop/cream-blazer.png',
        category: 'Blazer',
        color: 'Ecru',
        colorSwatch: 'oklch(0.91 0.02 85)',
        season: 'Summer',
        tags: ['Relaxed', 'Tailored', 'Layerable'],
        wornPhotos: [],
        lastWorn: {
          date: 'Sep 8',
          occasion: 'Lunch meeting',
          pairedWith: ['Ivory Silk Camisole', 'Ecru Straight Trousers'],
        },
        museAdvice:
          "Throw it over the cashmere and your loungewear becomes an outfit. Sleeves pushed up, over a tank and jeans, it's the easiest way to look pulled-together.",
      },
      {
        id: 'navy-blazer',
        name: 'Navy Double-Breasted Blazer',
        image: '/closet/navy-blazer.png',
        category: 'Blazer',
        color: 'Navy',
        colorSwatch: 'oklch(0.38 0.06 255)',
        season: 'All season',
        tags: ['Sharp', 'Structured', 'Polished'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 6',
          occasion: 'Client meeting',
          pairedWith: ['Ivory Silk Camisole', 'Ecru Straight Trousers'],
        },
        museAdvice:
          "Your power piece. Silk cami and ecru trousers underneath reads confident but never stuffy — exactly right for an interview. Gold buttons mean skip loud jewelry.",
      },
      {
        id: 'shearling-jacket',
        name: 'Suede Shearling Jacket',
        image: '/closet/shearling-jacket.png',
        category: 'Jacket',
        color: 'Tan',
        colorSwatch: 'oklch(0.68 0.06 62)',
        season: 'Winter',
        tags: ['Bohemian', 'Suede', 'Statement'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 3',
          occasion: 'Flea market Sunday',
          pairedWith: ['Broderie Sundress', 'Tan Knee-High Boots'],
        },
        museAdvice:
          "So much soul — this is the Spanish-girl piece. Over the white sundress with tall boots, or the denim mini, it brings instant warmth and character. Let it be the story.",
      },
    ],
  },
  {
    id: 'shoes',
    title: 'Shoes',
    description: 'Sneakers, heels, flats & boots',
    items: [
      {
        id: 'white-sneakers',
        name: 'White Leather Sneakers',
        image: '/closet/white-sneakers.png',
        category: 'Sneakers',
        color: 'White',
        colorSwatch: 'oklch(0.98 0.005 90)',
        season: 'All season',
        tags: ['Everyday', 'Minimal', 'Comfort'],
        wornPhotos: ['/closet/worn/white-sneakers-worn.png'],
        lastWorn: {
          date: 'Nov 12',
          occasion: 'Sunday brunch with friends',
          pairedWith: ['Cream Cashmere Sweater', 'Beige Wide-Leg Trousers'],
        },
        museAdvice:
          "Keep them box-fresh — they're what makes tailored pieces modern. Try them under the floral midi for high-low contrast; a clean sneaker always looks deliberate.",
      },
      {
        id: 'nude-heels',
        name: 'Nude Strappy Heels',
        image: '/closet/nude-heels.png',
        category: 'Heels',
        color: 'Nude',
        colorSwatch: 'oklch(0.84 0.04 60)',
        season: 'All season',
        tags: ['Evening', 'Elegant', 'Occasion'],
        wornPhotos: ['/closet/worn/nude-heels-worn.png'],
        lastWorn: {
          date: 'Nov 4',
          occasion: 'Dinner reservation downtown',
          pairedWith: ['Rose Silk Blouse', 'Beige Wide-Leg Trousers'],
        },
        museAdvice:
          "The nude tone elongates your leg with everything — that's why they work so hard. Reach for them with the black midi or the polka wrap when you want lift.",
      },
      {
        id: 'espadrilles',
        name: 'Tan Woven Espadrilles',
        image: '/closet/espadrilles.png',
        category: 'Sandals',
        color: 'Tan',
        colorSwatch: 'oklch(0.72 0.06 65)',
        season: 'Summer',
        tags: ['Casual', 'Woven', 'Vacation'],
        wornPhotos: ['/closet/worn/espadrilles-worn.png'],
        lastWorn: {
          date: 'Aug 18',
          occasion: 'Garden lunch',
          pairedWith: ['Peach Floral Midi', 'Woven Straw Tote'],
        },
        museAdvice:
          "They carry the whole summer wardrobe. Pack them with the broderie sundress and you're set for any warm-weather day, from market to dinner.",
      },
      {
        id: 'loafers',
        name: 'Black Leather Loafers',
        image: '/closet/loafers.png',
        category: 'Flats',
        color: 'Black',
        colorSwatch: 'oklch(0.3 0.01 280)',
        season: 'All season',
        tags: ['Preppy', 'Polished', 'Menswear'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 6',
          occasion: 'Client meeting',
          pairedWith: ['Black Cigarette Trousers', 'Navy Double-Breasted Blazer'],
        },
        museAdvice:
          "The in-between shoe that fixes everything — cooler than a heel, sharper than a sneaker. Cuffed jeans, cropped trousers, even the pleated skirt. Wear with a bare ankle.",
      },
      {
        id: 'tall-boots',
        name: 'Tan Knee-High Boots',
        image: '/closet/tall-boots.png',
        category: 'Boots',
        color: 'Tan',
        colorSwatch: 'oklch(0.62 0.07 60)',
        season: 'Autumn',
        tags: ['Riding', 'Leather', 'Statement'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 7',
          occasion: 'Museum then wine',
          pairedWith: ['Chocolate Turtleneck', 'Ecru Straight Trousers'],
        },
        museAdvice:
          "These make autumn dressing effortless. Tuck the ecru trousers in, or wear over tights with the black midi. The tan warms up anything cool-toned.",
      },
      {
        id: 'ballet-flats',
        name: 'Red Ballet Flats',
        image: '/closet/ballet-flats.png',
        category: 'Flats',
        color: 'Red',
        colorSwatch: 'oklch(0.55 0.17 25)',
        season: 'All season',
        tags: ['Playful', 'Feminine', 'Pop'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 2',
          occasion: 'Weekend market wander',
          pairedWith: ['Breton Striped Tee', 'Vintage Straight Jeans'],
        },
        museAdvice:
          "Your one hit of colour — and red is a neutral, I promise. With the Breton and jeans they're pure Paris; with the cream pleated skirt they're the whole outfit.",
      },
    ],
  },
  {
    id: 'accessories',
    title: 'Bags & Accessories',
    description: 'Bags, jewelry & finishing touches',
    items: [
      {
        id: 'straw-tote',
        name: 'Woven Straw Tote',
        image: '/shop/straw-tote.png',
        category: 'Bag',
        color: 'Natural',
        colorSwatch: 'oklch(0.82 0.05 80)',
        season: 'Summer',
        tags: ['Roomy', 'Woven', 'Vacation'],
        wornPhotos: [],
        lastWorn: {
          date: 'Aug 18',
          occasion: 'Garden lunch',
          pairedWith: ['Peach Floral Midi', 'Tan Woven Espadrilles'],
        },
        museAdvice:
          "Reads instantly summer and holds a whole day of wandering. It's the natural partner to every linen and cotton piece you own.",
      },
      {
        id: 'tan-crossbody',
        name: 'Tan Leather Crossbody',
        image: '/closet/crossbody.png',
        category: 'Bag',
        color: 'Tan',
        colorSwatch: 'oklch(0.66 0.06 62)',
        season: 'All season',
        tags: ['Hands-free', 'Everyday', 'Leather'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 11',
          occasion: 'Gallery opening',
          pairedWith: ['Breton Striped Tee', 'Vintage Straight Jeans'],
        },
        museAdvice:
          "The travel bag — hands-free for a day of walking, and the tan goes with your whole warm-neutral world. Wear it cross-body over the trench to break up the length.",
      },
      {
        id: 'black-shoulder-bag',
        name: 'Black Structured Shoulder Bag',
        image: '/closet/shoulder-bag.png',
        category: 'Bag',
        color: 'Black',
        colorSwatch: 'oklch(0.3 0.01 280)',
        season: 'All season',
        tags: ['Structured', 'Evening', 'Sleek'],
        wornPhotos: [],
        lastWorn: {
          date: 'Oct 22',
          occasion: 'Rooftop drinks in SoHo',
          pairedWith: ['Black Leather Midi Skirt', 'Ivory Silk Camisole'],
        },
        museAdvice:
          "The grown-up evening bag. Its clean structure sharpens the softest outfit — carry it with the slip dress or the black midi and everything looks more expensive.",
      },
      {
        id: 'gold-hoops',
        name: 'Fine Gold Hoops',
        image: '/shop/gold-hoops.png',
        category: 'Jewelry',
        color: 'Gold',
        colorSwatch: 'oklch(0.8 0.1 85)',
        season: 'All season',
        tags: ['Warm', 'Everyday', 'Delicate'],
        wornPhotos: [],
        lastWorn: {
          date: 'Nov 4',
          occasion: 'Dinner reservation downtown',
          pairedWith: ['Rose Silk Blouse', 'Nude Strappy Heels'],
        },
        museAdvice:
          "The one piece of jewelry that finishes everything. Warm gold against your evening looks is all you need — resist adding more and let them do their quiet work.",
      },
      {
        id: 'silk-scarf',
        name: 'Silk Head Scarf',
        image: '/shop/silk-scarf.png',
        category: 'Accessory',
        color: 'Rose / Peach',
        colorSwatch: 'oklch(0.8 0.08 30)',
        season: 'All season',
        tags: ['Versatile', 'Silk', 'Playful'],
        wornPhotos: [],
        lastWorn: {
          date: 'Sep 2',
          occasion: 'Top-down drive',
          pairedWith: ['Breton Striped Tee', 'Red Ballet Flats'],
        },
        museAdvice:
          "Tie it in your hair, at your neck, or on the crossbody strap — three accessories in one. It ties your rose and peach pieces together and adds movement.",
      },
    ],
  },
]

export function Closet() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploads, setUploads] = useState<{ id: string; url: string }[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<ClosetItem | null>(null)

  const totalItems = useMemo(
    () => SECTIONS.reduce((sum, s) => sum + s.items.length, 0) + uploads.length,
    [uploads.length],
  )

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SECTIONS
    return SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        [item.name, item.category, item.color, item.season, ...item.tags]
          .join(' ')
          .toLowerCase()
          .includes(q),
      ),
    })).filter((section) => section.items.length > 0)
  }, [query])

  function handleFiles(files: FileList | null) {
    if (!files) return
    const next = Array.from(files).map((file) => ({
      id: Math.random().toString(36).slice(2),
      url: URL.createObjectURL(file),
    }))
    setUploads((prev) => [...next, ...prev])
  }

  function removeUpload(id: string) {
    setUploads((prev) => {
      const target = prev.find((u) => u.id === id)
      if (target) URL.revokeObjectURL(target.url)
      return prev.filter((u) => u.id !== id)
    })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-8 pb-16 pt-2">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl leading-tight text-foreground text-balance">
            Your Closet
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalItems} pieces, beautifully organized
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-sm transition-all duration-300 focus-within:border-primary/35">
            <Search size={16} className="text-muted-foreground" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your wardrobe…"
              aria-label="Search your wardrobe"
              className="w-40 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/30 active:scale-95"
          >
            <Camera size={17} strokeWidth={2} aria-hidden />
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="sr-only"
            aria-hidden
            tabIndex={-1}
          />
        </div>
      </div>

      {/* Import sources */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Import from
        </span>
        <ComingSoonChip icon={LayoutGrid} label="Pinterest" />
        <ComingSoonChip icon={Aperture} label="Instagram" />
      </div>

      {/* Recently added uploads */}
      {uploads.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="font-serif text-2xl text-foreground">
              Recently added
            </h2>
            <span className="text-sm text-muted-foreground">
              {uploads.length} new
            </span>
          </div>
          <div className="muse-stagger grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="muse-fade-up group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={upload.url || '/placeholder.svg'}
                    alt="Newly uploaded clothing"
                    fill
                    sizes="(max-width: 1024px) 45vw, 260px"
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeUpload(upload.id)}
                    aria-label="Remove upload"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground/70 backdrop-blur-md transition-colors hover:text-destructive"
                  >
                    <X size={15} strokeWidth={2} aria-hidden />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Awaiting details
                  </p>
                  <h4 className="mt-1 font-serif text-lg leading-tight text-card-foreground">
                    New piece
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sections */}
      {filteredSections.length === 0 ? (
        <div className="muse-fade-up mt-20 flex flex-col items-center justify-center text-center">
          <span className="muse-elev flex h-16 w-16 items-center justify-center rounded-3xl bg-card text-primary">
            <Shirt size={26} strokeWidth={1.6} aria-hidden />
          </span>
          <p className="mt-5 font-serif text-2xl text-foreground text-balance">
            Nothing matches “{query}”
          </p>
          <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
            Try a different color, season, or category — or clear the search to
            see your whole wardrobe.
          </p>
        </div>
      ) : (
        filteredSections.map((section) => (
          <section key={section.id} className="mt-12">
            <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-border/60 pb-3">
              <div>
                <h2 className="font-serif text-2xl text-foreground">
                  {section.title}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {section.items.length}{' '}
                {section.items.length === 1 ? 'piece' : 'pieces'}
              </span>
            </div>
            <div className="muse-stagger grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {section.items.map((item) => (
                <ClosetItemCard
                  key={item.id}
                  item={item}
                  onSelect={setSelected}
                />
              ))}
            </div>
          </section>
        ))
      )}

      <ClosetItemDetail item={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
