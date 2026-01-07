<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int $ai_jam_id
 * @property string|null $variation
 * @property string $audio_url
 * @property int|null $duration
 * @property string $created_at
 * @property-read \App\Models\AiJam $aiJam
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiBackingTrack newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiBackingTrack newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiBackingTrack query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiBackingTrack whereAiJamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiBackingTrack whereAudioUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiBackingTrack whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiBackingTrack whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiBackingTrack whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiBackingTrack whereVariation($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAiBackingTrack {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $profile_id
 * @property int $source_track_id
 * @property string|null $key
 * @property int|null $tempo_bpm
 * @property string|null $style
 * @property array<array-key, mixed>|null $chords
 * @property string $status
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AiBackingTrack> $backingTracks
 * @property-read int|null $backing_tracks_count
 * @property-read \App\Models\Profile $profile
 * @property-read \App\Models\UserTrack $sourceTrack
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam whereChords($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam whereProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam whereSourceTrackId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam whereStyle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiJam whereTempoBpm($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAiJam {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $provider
 * @property string|null $provider_user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthProvider newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthProvider newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthProvider query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthProvider whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthProvider whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthProvider whereProvider($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthProvider whereProviderUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthProvider whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthProvider whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAuthProvider {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $band_suggestion_id
 * @property int|null $conversation_id
 * @property string $created_at
 * @property-read \App\Models\Conversation|null $conversation
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BandMember> $members
 * @property-read int|null $members_count
 * @property-read \App\Models\BandSuggestion|null $suggestion
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Band newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Band newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Band query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Band whereBandSuggestionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Band whereConversationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Band whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Band whereId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperBand {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $band_id
 * @property int $profile_id
 * @property \Illuminate\Support\Carbon $joined_at
 * @property-read \App\Models\Band $band
 * @property-read \App\Models\Profile $profile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandMember newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandMember newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandMember query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandMember whereBandId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandMember whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandMember whereJoinedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandMember whereProfileId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperBandMember {}
}

namespace App\Models{
/**
 * @property int $id
 * @property array<array-key, mixed> $profile_ids
 * @property string $status
 * @property string $created_at
 * @property-read \App\Models\Band|null $band
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BandSuggestionMember> $members
 * @property-read int|null $members_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestion whereProfileIds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestion whereStatus($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperBandSuggestion {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $band_suggestion_id
 * @property int $profile_id
 * @property string $decision
 * @property \Illuminate\Support\Carbon|null $decided_at
 * @property-read \App\Models\BandSuggestion $bandSuggestion
 * @property-read \App\Models\Profile $profile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestionMember newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestionMember newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestionMember query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestionMember whereBandSuggestionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestionMember whereDecidedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestionMember whereDecision($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestionMember whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BandSuggestionMember whereProfileId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperBandSuggestionMember {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $type
 * @property string|null $name
 * @property string $created_at
 * @property-read \App\Models\Band|null $band
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Message> $messages
 * @property-read int|null $messages_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ConversationParticipant> $participants
 * @property-read int|null $participants_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereType($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperConversation {}
}

namespace App\Models{
/**
 * @property int $conversation_id
 * @property int $profile_id
 * @property-read \App\Models\Conversation $conversation
 * @property-read \App\Models\Profile $profile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConversationParticipant newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConversationParticipant newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConversationParticipant query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConversationParticipant whereConversationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConversationParticipant whereProfileId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperConversationParticipant {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Profile> $profiles
 * @property-read int|null $profiles_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre whereName($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperGenre {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Profile> $profiles
 * @property-read int|null $profiles_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instrument newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instrument newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instrument query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instrument whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instrument whereName($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperInstrument {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $sender_profile_id
 * @property int $receiver_profile_id
 * @property string|null $message
 * @property string $status
 * @property \Illuminate\Support\Carbon $created_at
 * @property string|null $responded_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JamRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JamRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JamRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JamRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JamRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JamRequest whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JamRequest whereReceiverProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JamRequest whereRespondedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JamRequest whereSenderProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JamRequest whereStatus($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperJamRequest {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $profile_one_id
 * @property int $profile_two_id
 * @property \Illuminate\Support\Carbon $created_at
 * @property-read \App\Models\Profile $profileOne
 * @property-read \App\Models\Profile $profileTwo
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MatchModel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MatchModel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MatchModel query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MatchModel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MatchModel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MatchModel whereProfileOneId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MatchModel whereProfileTwoId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperMatchModel {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $conversation_id
 * @property int $sender_profile_id
 * @property string $type
 * @property string|null $body
 * @property string|null $voice_url
 * @property int|null $track_id
 * @property \Illuminate\Support\Carbon $sent_at
 * @property string $created_at
 * @property-read \App\Models\Conversation $conversation
 * @property-read \App\Models\Profile $sender
 * @property-read \App\Models\UserTrack|null $track
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereConversationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereSenderProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereSentAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereTrackId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereVoiceUrl($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperMessage {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $profile_id
 * @property string $type
 * @property array<array-key, mixed>|null $data
 * @property bool $is_read
 * @property string $created_at
 * @property-read \App\Models\Profile $profile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereIsRead($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereType($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperNotification {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Profile> $profiles
 * @property-read int|null $profiles_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Objective newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Objective newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Objective query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Objective whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Objective whereName($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperObjective {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string|null $username
 * @property string|null $bio
 * @property string|null $location
 * @property \Illuminate\Support\Carbon|null $birth_date
 * @property string $gender
 * @property string $experience_level
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Genre> $genres
 * @property-read int|null $genres_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Instrument> $instruments
 * @property-read int|null $instruments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProfileMedia> $media
 * @property-read int|null $media_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Objective> $objectives
 * @property-read int|null $objectives_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Swipe> $swipesReceived
 * @property-read int|null $swipes_received_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Swipe> $swipesSent
 * @property-read int|null $swipes_sent_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereBio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereBirthDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereExperienceLevel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profile whereUsername($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperProfile {}
}

namespace App\Models{
/**
 * @property int $profile_id
 * @property float $embedding
 * @property \Illuminate\Support\Carbon $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileEmbedding newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileEmbedding newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileEmbedding query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileEmbedding whereEmbedding($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileEmbedding whereProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileEmbedding whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperProfileEmbedding {}
}

namespace App\Models{
/**
 * @property int $profile_id
 * @property int $genre_id
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileGenre newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileGenre newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileGenre query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileGenre whereGenreId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileGenre whereProfileId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperProfileGenre {}
}

namespace App\Models{
/**
 * @property int $profile_id
 * @property int $instrument_id
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileInstrument newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileInstrument newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileInstrument query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileInstrument whereInstrumentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileInstrument whereProfileId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperProfileInstrument {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $profile_id
 * @property string $media_type
 * @property string $media_url
 * @property int $order_index
 * @property string $created_at
 * @property-read \App\Models\Profile $profile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileMedia newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileMedia newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileMedia query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileMedia whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileMedia whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileMedia whereMediaType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileMedia whereMediaUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileMedia whereOrderIndex($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileMedia whereProfileId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperProfileMedia {}
}

namespace App\Models{
/**
 * @property int $profile_id
 * @property int $objective_id
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileObjective newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileObjective newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileObjective query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileObjective whereObjectiveId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileObjective whereProfileId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperProfileObjective {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $sender_profile_id
 * @property int $receiver_profile_id
 * @property int $track_id
 * @property string $created_at
 * @property-read \App\Models\Profile $receiver
 * @property-read \App\Models\Profile $sender
 * @property-read \App\Models\UserTrack $track
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SharedTrack newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SharedTrack newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SharedTrack query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SharedTrack whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SharedTrack whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SharedTrack whereReceiverProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SharedTrack whereSenderProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SharedTrack whereTrackId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperSharedTrack {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $swiper_profile_id
 * @property int $swiped_profile_id
 * @property string $direction
 * @property \Illuminate\Support\Carbon $created_at
 * @property-read \App\Models\Profile $swiped
 * @property-read \App\Models\Profile $swiper
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Swipe newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Swipe newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Swipe query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Swipe whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Swipe whereDirection($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Swipe whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Swipe whereSwipedProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Swipe whereSwiperProfileId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperSwipe {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $email
 * @property string|null $email_verified_at
 * @property string|null $password
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AuthProvider> $authProviders
 * @property-read int|null $auth_providers_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \App\Models\Profile|null $profile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperUser {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $blocker_profile_id
 * @property int $blocked_profile_id
 * @property string $created_at
 * @property-read \App\Models\Profile $blocked
 * @property-read \App\Models\Profile $blocker
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBlock newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBlock newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBlock query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBlock whereBlockedProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBlock whereBlockerProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBlock whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBlock whereId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperUserBlock {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $reporter_profile_id
 * @property int $reported_profile_id
 * @property string $reason
 * @property string|null $description
 * @property string $created_at
 * @property-read \App\Models\Profile $reported
 * @property-read \App\Models\Profile $reporter
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserReport newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserReport newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserReport query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserReport whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserReport whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserReport whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserReport whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserReport whereReportedProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserReport whereReporterProfileId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperUserReport {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $profile_id
 * @property string $title
 * @property string $audio_url
 * @property int|null $duration
 * @property string $track_type
 * @property string $visibility
 * @property string|null $source
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AiJam> $aiJams
 * @property-read int|null $ai_jams_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Message> $messages
 * @property-read int|null $messages_count
 * @property-read \App\Models\Profile $profile
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SharedTrack> $sharedTracks
 * @property-read int|null $shared_tracks_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack whereAudioUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack whereProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack whereSource($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack whereTrackType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserTrack whereVisibility($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperUserTrack {}
}

