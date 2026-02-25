<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContactInquiry;
use Illuminate\Support\Str;

class ZimbabweanInquiriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $firstNames = [
            'Tendai', 'Tinashe', 'Tariro', 'Kudzi', 'Farai', 'Chipo', 'Rutendo', 'Nyasha', 'Tatenda', 
            'Ruvarashe', 'Tafadzwa', 'Simbarashe', 'Anesu', 'Kudzai', 'Panashe', 'Tapiwa', 'Ropafadzo', 
            'Fadzai', 'Tanaka', 'Maita', 'Ruvimbo', 'Shingai', 'Vimbai', 'Munyaradzi', 'Taurai',
            'Sibusiso', 'Thabani', 'Nqobizitha', 'Lindiwe', 'Bongani', 'Thandiwe', 'Thembinkosi'
        ];
        
        $surnames = [
            'Moyo', 'Ncube', 'Sibanda', 'Ndlovu', 'Mutasa', 'Gumbo', 'Dube', 'Chigumba', 'Katsande', 
            'Machingura', 'Chikowore', 'Mukanya', 'Dziva', 'Muzenda', 'Shumba', 'Makoni', 'Zhuwao', 
            'Chiweshe', 'Mutizwa', 'Ndlela', 'Nkomo', 'Bhebhe', 'Nyoni', 'Tshuma', 'Mpofu', 'Khumalo', 'Mapfumo'
        ];

        $subjects = [
            'Tell Parliament: Protect Our Rights', 'Petition: Not Her Choice', 'Urgent: Support The Campaign', 
            'End Child Marriages Now', 'Raise The Age of Consent', 'Protect Young Girls', 
            'I Stand With Not Her Choice', 'My Signature for the Petition', 'Stop Child Marriages'
        ];

        $messages = [
            'I am signing this petition to demand that parliament takes immediate action to protect young girls from early marriages. It is time to raise the age of consent.',
            'Please add my name to the list of citizens standing against child marriages. The law needs to be clear and enforced to protect our children.',
            'As a concerned citizen of Zimbabwe, I fully support the Not Her Choice campaign. Parliament must act now to safeguard the future of young girls.',
            'I want to formally submit my support for the petition. We cannot stand by while young girls are forced into marriages. The government must intervene.',
            'This is my official signature for the Tell Parliament campaign. Ensuring the safety and rights of children should be our top priority.',
            'I stand with the victims and demand stronger legislation to prevent early and forced child marriages. Add my voice to the petition.',
            'Our girls deserve a chance at education and a bright future, not early marriage. I fully back this petition and urge lawmakers to make a change.',
            'Please count my signature in. It is critical that we close any loopholes in the law that allow child marriages to continue in our communities.',
            'I am writing to express my strong support for raising the age of consent to protect vulnerable children. Parliament needs to pass the proposed amendments without delay.'
        ];

        // Ensure these match the ENUM allowed in the database: ['general', 'project', 'career']
        $types = ['general', 'project', 'career'];
        $statuses = ['new', 'read', 'replied', 'archived'];

        $totalRecords = 5628;
        $chunkSize = 500;
        $inserted = 0;

        $this->command->info("Creating {$totalRecords} Zimbabwean contact inquiries...");

        $domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'hotmail.com'];
        $locations = [
            'Borrowdale, Harare', 'Mbare, Harare', 'Avondale, Harare', 'Highfield, Harare',
            'Sunninghill, Bulawayo', 'Nkulumane, Bulawayo', 'Khumalo, Bulawayo', 'Makokoba, Bulawayo',
            'Dangamvura, Mutare', 'Chikanga, Mutare', 'Palmerstone, Mutare',
            'Mucheke, Masvingo', 'Rhodene, Masvingo', 'Rujeko, Masvingo',
            'Mandava, Zvishavane', 'Makwasha, Zvishavane',
            'Mkhosana, Victoria Falls', 'Chinotimba, Victoria Falls',
            'Mkoba, Gweru', 'Senga, Gweru', 'Southdowns, Gweru'
        ];

        while ($inserted < $totalRecords) {
            $currentChunk = min($chunkSize, $totalRecords - $inserted);
            $batch = [];

            for ($i = 0; $i < $currentChunk; $i++) {
                $firstName = $firstNames[array_rand($firstNames)];
                $lastName = $surnames[array_rand($surnames)];
                $name = "{$firstName} {$lastName}";
                
                $emailDomain = $domains[array_rand($domains)];
                $email = strtolower($firstName) . '.' . strtolower($lastName) . random_int(1, 999) . '@' . $emailDomain;
                
                $subject = "Sign the petition Submission";
                
                // We keep some variety for the actual message body, or clear it if it's meant to be blank
                $message = $messages[array_rand($messages)];
                $type = $types[array_rand($types)];
                $status = $statuses[array_rand($statuses)];
                
                $location = $locations[array_rand($locations)];

                $batch[] = [
                    'name' => $name,
                    'email' => $email,
                    'subject' => $subject,
                    'message' => $message,
                    'type' => $type,
                    'status' => $status,
                    'metadata' => json_encode([
                        'source' => 'web', 
                        'timestamp' => now()->toIso8601String(),
                        'all_fields' => [
                            'location' => $location,
                            'i_support' => ['I agree that the law should be changed as expressed in this petition']
                        ]
                    ]),
                    'created_at' => now()->subDays(random_int(0, 365))->toDateTimeString(),
                    'updated_at' => now()->toDateTimeString(),
                ];
            }

            \Illuminate\Support\Facades\DB::table('contact_inquiries')->insert($batch);
            $inserted += $currentChunk;
            
            $this->command->info("Inserted {$inserted} / {$totalRecords} records...");
        }

        $this->command->info("Successfully seeded 5628 Zimbabwean contact inquiries!");
    }
}
