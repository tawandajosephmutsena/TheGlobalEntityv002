import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { EnterprisePricingBlock } from '@/types/page-blocks';

// Optional SVGs if they exist in the project
// import { Spotify } from '@/components/ui/svgs/spotify';
// import { Hulu } from '@/components/ui/svgs/hulu';
// import { FirebaseFull } from '@/components/ui/svgs/firebase';

export default function EnterprisePricingBlockRenderer(props: EnterprisePricingBlock['content']) {
    const {
        heading = 'Start managing your company smarter today',
        planName = 'Suite Enterprise',
        planDescription = 'For your company of any size',
        priceAmount = '234',
        priceCurrency = '$',
        buttonText = 'Get started',
        buttonLink = '#',
        featuresText = 'Includes : Security, Unlimited Storage, Payment, Search engine, and all features',
        features = [
            { text: 'First premium advantage' },
            { text: 'Second advantage weekly' },
            { text: 'Third advantage donate to project' },
            { text: 'Fourth, access to all components weekly' }
        ],
        trustedText = 'Team can be any size, and you can add or switch members as needed. Companies using our platform include:',
    } = props || {};

    return (
        <AnimatedSection className="relative py-16 md:py-32 bg-background text-foreground">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        {heading}
                    </h2>
                </div>
                <div className="mt-8 md:mt-20">
                    <div className="bg-card relative rounded-3xl border border-border shadow-2xl shadow-zinc-950/5">
                        <div className="grid items-center gap-12 divide-y border-border p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
                            <div className="pb-12 text-center md:pb-0 md:pr-12">
                                <h3 className="text-2xl font-semibold">{planName}</h3>
                                <p className="mt-2 text-lg text-muted-foreground">{planDescription}</p>
                                <span className="mb-6 mt-12 inline-block text-6xl font-bold">
                                    {priceCurrency && <span className="text-4xl">{priceCurrency}</span>}
                                    {priceAmount}
                                </span>

                                <div className="flex justify-center">
                                    <Button asChild size="lg">
                                        <a href={buttonLink}>{buttonText}</a>
                                    </Button>
                                </div>

                                <p className="text-muted-foreground mt-12 text-sm">{featuresText}</p>
                            </div>
                            <div className="relative">
                                <ul role="list" className="space-y-4">
                                    {features.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <Check className="size-3 text-primary" />
                                            <span>{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-muted-foreground mt-6 text-sm">{trustedText}</p>
                                
                                {/* Assuming SVGs exist, otherwise replace with logos if needed */}
                                <div className="**:fill-foreground mt-12 flex flex-wrap items-center gap-12 opacity-50 grayscale transition-all hover:grayscale-0">
                                    {/* <Hulu height={18} width={56} /> */}
                                    {/* <Spotify height={24} width={80} /> */}
                                    {/* <FirebaseFull height={24} width={80} /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
