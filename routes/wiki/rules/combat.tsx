import { define } from "@/utils.ts";
import {
  RulesCallout,
  RulesSection,
  RulesToc,
  WikiRulesLayout,
} from "@/components/WikiRulesLayout.tsx";

export default define.page(function WikiRulesCombat() {
  return (
    <WikiRulesLayout
      title="Combat"
      description="Attacks, weapons, cover, movement, stealth, traps, grappling, armor, and related combat rules."
      currentHref="/wiki/rules/combat"
    >
      <RulesToc
        items={[
          { id: "attacking", label: "Attacking and defending" },
          { id: "weapons", label: "Weapons and damage" },
          { id: "misc-gear", label: "Misc gear" },
          { id: "minimum", label: "Minimum hit chance and damage" },
          { id: "cover", label: "Cover" },
          { id: "initiative", label: "Initiative and movement" },
          { id: "stealth", label: "Ambushing, perception, and stealth" },
          { id: "traps", label: "Traps" },
          { id: "dual-wielding", label: "Dual wielding" },
          { id: "mounting", label: "Mounting" },
          { id: "holding", label: "Holding actions" },
          { id: "grappling", label: "Grappling" },
          { id: "altitude", label: "Altitude and flying" },
          { id: "armor", label: "Armor" },
          { id: "visibility", label: "Darkness, fog, and smoke" },
        ]}
      />

      <RulesSection id="attacking" title="Attacking and defending">
        <p>
          To attack someone in melee, you roll Strength. It is a contested
          Strength check.
        </p>
        <p>
          To attack someone with a ranged weapon, you roll your Dexterity versus
          their cover. If they have no cover, you still need 1 success.
        </p>
      </RulesSection>

      <RulesSection id="weapons" title="Weapons and damage">
        <p>
          All weapons are detailed in the{" "}
          <a href="/wiki/weapons" class="text-primary hover:underline">
            weapons wiki
          </a>
          , alongside their stats and gimmicks. The list does not encompass
          every weapon in existence. The general rules below cover the rest.
        </p>

        <h3 class="text-lg font-semibold pt-2">Ranged</h3>
        <p>
          Random thrown objects deal 2 damage. Chairs, rocks, bricks, and so on.
          They have 1 weight.
        </p>
        <p>
          Rate of fire describes how many shots you can fire in one turn. You
          can shoot multiple targets per turn, but you must waste one shot per
          additional target.
        </p>
        <RulesCallout>
          <p>
            <strong>Example:</strong>{" "}
            you have a rate of fire of 5, and want to shoot 3 targets. You
            shoot, waste, shoot, waste, shoot. You waste 2 bullets because you
            have 2 additional targets past the first one.
          </p>
        </RulesCallout>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            If you have multiple ammo types, you must declare the order your
            shots are loaded in. If you fire multiple times in a turn, your
            successes fire the bullets in the order you declared.
          </li>
          <li>
            Shooting each target is rolled individually. In the example above,
            you must roll your shooting stats three times, against the three
            enemies' covers.
          </li>
          <li>
            You need 1 success over the opponent's cover to shoot them. Every
            success above that is an additional shot into your target, up to how
            many shots you have fired.
          </li>
          <li>Every shot past the first adds +1d6 to your accuracy.</li>
          <li>Damage reductions apply to each shot individually.</li>
        </ul>

        <h3 class="text-lg font-semibold pt-2">Melee</h3>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            Unarmed combat deals 1 damage (fists, slaps, biting). They have no
            weight; they are a part of you.
          </li>
          <li>
            Random objects are called makeshift weapons. They deal 2 damage,
            have 1 weight, and have no gimmicks other than being one- or
            two-handed.
          </li>
        </ul>
      </RulesSection>

      <RulesSection id="misc-gear" title="Misc gear">
        <p>
          A soldier, naturally, has more than just a gun. There is misc gear to
          choose from in the{" "}
          <a href="/wiki/equipment" class="text-primary hover:underline">
            equipment wiki
          </a>
          . The consumables listed there are charges: you get an X amount of
          uses per scene, and they regenerate afterwards.
        </p>
        <p>
          Every piece of misc gear has a flat 1 weight unless stated otherwise.
          You start with 3 free pieces of gear, but you may need to justify how
          you got them depending on how uncommon or rare they would be for you
          to get. This is based on where you are, who you are, your role, and
          similar factors.
        </p>
      </RulesSection>

      <RulesSection id="minimum" title="Minimum hit chance and damage">
        <p>
          Every attack, unless stated otherwise through some perk or gimmick,
          always has a 1d6 chance to hit, and deals at minimum 1 damage.
        </p>
      </RulesSection>

      <RulesSection id="cover" title="Cover">
        <p>
          You automatically take cover when you move into it, unless
          specifically stated otherwise due to special conditions.
        </p>
        <p>
          Cover has four ratings: weak (2d6), middling (4d6), strong (6d6), and
          fortified (8d6). Certain perks can make cover stronger.
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            <strong>Weak</strong>{" "}
            cover does not actually block shots, but does block vision: tall
            grass, curtains. These offer 2d6.
          </li>
          <li>
            <strong>Middling</strong>{" "}
            cover offers considerable cover, but is not intended to: a
            building's wall, a car. These offer 4d6.
          </li>
          <li>
            <strong>Strong</strong>{" "}
            cover is anything militarily built for taking hits: tanks, trenches,
            sandbags. These offer 6d6.
          </li>
          <li>
            Only the Sapper perk can build 8d6 <strong>fortified</strong>{" "}
            cover. It is an upgraded strong cover.
          </li>
        </ul>
        <p>Cover has no effect on melee.</p>
      </RulesSection>

      <RulesSection id="initiative" title="Initiative and movement">
        <p>
          Initiative is ordered from highest Dexterity to lowest. In case of
          ties, all tied parties roll their Dexterities; whoever has more
          successes goes first among them. Roll off multiple times if needed.
          Relevant perks apply.
        </p>
        <p>
          Distance to someone is measured in "distance" units. These are
          relative to you and your target, or a reference point. They represent
          5 meters worth of distance.
        </p>
        <p>
          Each character can only move 1 distance per turn. Moving is considered
          your action for the turn; it is not free.
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            Distance 0 is melee range. You can only melee attack someone if you
            are in distance 0. You cannot perform ranged attacks if there are
            enemies within distance 0. If someone tries to leave distance 0,
            they may be freely melee-attacked as a free action. Such an attack
            can only be done once per character. You may defend yourself from
            such attacks. There is no safe disengagement.
          </li>
          <li>
            Distances 1 and beyond forbid melee attacks, but allow ranged
            attacks.
          </li>
          <li>
            Each distance may have usable cover so as to approach gunners with
            relative safety.
          </li>
          <li>
            For every 10 distances away from the target, you have a −3d6 penalty
            to shoot them.
          </li>
        </ul>
        <p>
          If there are allies in the same distance as your enemy, and you are
          shooting them from 1 distance away or beyond, you need 1 additional
          success for each ally within that group in order to hit an enemy. If
          you do not have as many successes as you have allies in that spot, you
          will shoot your ally instead, in order of initiative.
        </p>
        <p>
          If there are 3× or more enemies as you have allies in a distance, you
          have no chance of hitting your allies, as there are enough enemies to
          pick a safe target to hit.
        </p>
      </RulesSection>

      <RulesSection id="stealth" title="Ambushing, perception, and stealth">
        <p>
          Stealth is a contested Intelligence check. If you succeed, the
          opponent is not aware of your presence. Otherwise, they are.
        </p>
        <p>
          A stealth check cannot be done if the enemy already knows where you
          are. You need to relocate and/or find a new hiding spot before you can
          stealth again.
        </p>
        <p>
          If you have succeeded in a stealth check, no further stealth checks
          are done unless the enemy spends their action to perform another
          contested Intelligence check, which can only be done if they are
          actively searching for you. If they are entirely unaware of your
          presence, no further perception checks may be made unless you do
          something they can reasonably spot, like walking by them or making
          noise.
        </p>
        <p>
          If you try to do something to someone you are hiding from — such as
          attacking them — you must do a final contested perception check, and
          this is considered an ambush. If multiple characters are involved, all
          roll their Intelligences, compare to one another, and then decide the
          action order individually.
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            If the ambush succeeds, the ones setting it up go first regardless
            of Dexterity, and their first actions automatically succeed against
            the targets that were ambushed.
          </li>
          <li>
            If the ambush fails, the ones being ambushed go first, regardless of
            Dexterity.
          </li>
        </ul>
        <p>
          Ambushing someone gives away your position, unless your attack cannot
          be detected, such as by using a suppressed or silent weapon.
        </p>
        <p>
          In order to spot someone at all, you must be within viewing range of
          them. Your comfortable view range is [Intelligence] × 20 + 40
          distances. If the enemy is beyond this range, you cannot accurately
          see them, and thus roll −3d6 for every 10 distances past your maximum
          comfortable view range.
        </p>
      </RulesSection>

      <RulesSection id="traps" title="Traps">
        <p>
          A trap is something set up to cause harm to another. When laying a
          trap, the trapmaster must decide whether the trap is incapacitating or
          killing.
        </p>
        <p>
          A trap then requires 2 Intelligence checks. The first is how
          well-hidden the trap is: the amount of successes prey needs to spot
          it. The second is how damaging it is, if at all: each success means
          one point of damage.
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            A killing trap can kill its prey, and its damage can push someone
            into negative HP directly.
          </li>
          <li>
            An incapacitating trap will never kill, even if its damage would be
            killing otherwise. Prey is always left at 0 HP.
          </li>
        </ul>
      </RulesSection>

      <RulesSection id="dual-wielding" title="Dual wielding">
        <p>
          Provided two items can be held with one single hand, you can wield
          them both at once. Additional members (such as a tail) can also hold
          items.
        </p>
        <p>
          Swapping hands is considered free. This extends to additional members
          — you can hold something with your tail and immediately grab onto it.
        </p>
        <p>
          Whether the additional member can manipulate items itself depends on
          specific perks. You cannot, for example, hold a pistol in one hand,
          then use a two-handed weapon with one hand and your tail, unless your
          tail allows for item manipulation.
        </p>
        <p>
          There are no penalties to dual-wielding. You can hold a pistol and a
          one-handed melee weapon and use both without issues.
        </p>
        <p>
          You can only use one item or weapon in a turn, not both. You cannot
          attack with both in the same turn.
        </p>
        <p>
          Weapons or items that are two-handed require you to use both hands to
          operate them. Unless specifically stated otherwise, every kit requires
          both hands to be used properly (survivalist, entrenching, demolition,
          and so on).
        </p>
      </RulesSection>

      <RulesSection id="mounting" title="Mounting">
        <p>It takes one turn to mount or dismount a creature.</p>
        <p>
          When mounting a mountable creature, you cannot move — it is the
          creature that does the moving instead. It uses their speed values, and
          your weight plus your gear's weight affects it. Carrying a lot of
          stuff, or having the Heavy perk, will affect your mount.
        </p>
        <p>
          Whilst mounted, moving becomes free, as it is your mount that is
          moving, not you. You may perform attacks at any point during movement:
          at the start, in the middle, or after. This means you can move up to
          someone, attack them, and then move away.
        </p>
        <p>
          If the mounted creature is a player, they give up their actions and
          let you take control instead, provided they are willing. The mounted
          player cannot act on their own anymore — they behave well and truly
          like your mount.
        </p>
      </RulesSection>

      <RulesSection id="holding" title="Holding actions">
        <p>
          You can create a basic "if [something] happens, then [I do this]"
          statement for your action. If the trigger does happen, your action
          takes priority over anyone else's.
        </p>
      </RulesSection>

      <RulesSection id="grappling" title="Grappling">
        <p>
          Grappling is a contested Strength check, where the one initiating the
          grapple adds the difference in Strength to their dice pool.
        </p>
        <RulesCallout>
          <p>
            <strong>Example:</strong>{" "}
            if you have 5 Strength and your target has 3, you roll 7 dice
            against their 3, because 2 is the difference between 5 and 3.
          </p>
        </RulesCallout>
        <p>
          A grappled target can still fight back. They can attack you or someone
          else, put away or pull out items, and so on. The only thing a grappled
          target cannot do is move.
        </p>
        <p>
          The target may try to break free from the grapple, which is a
          contested Strength vs Strength check, in which the one holding the
          grapple still applies the difference between Strengths to their dice
          pool.
        </p>
        <p>
          After a target is grappled, you may do <strong>one</strong>{" "}
          of several things as an action on your subsequent turns:
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            You may drag them alongside you, moving them however many distances
            you can also move.
          </li>
          <li>
            You may pin them, putting them onto the ground and holding them
            there. In a pin, a character may do nothing but try to break free,
            which is a contested Strength check where they roll twice, always
            taking the worse roll. The one who initiated the grapple still adds
            the difference in Strengths.
          </li>
          <li>
            You may eat them, which is a contested Strength check. The one who
            initiated the grapple still adds the difference in Strengths. On a
            success, the target is devoured. See the{" "}
            <a href="/wiki/rules/vore" class="text-primary hover:underline">
              vore rules
            </a>{" "}
            for more.
          </li>
          <li>
            You may use them as a human shield, making enemies target them
            instead of you. You must hold them with at least one hand. Enemies
            deal damage to your human shield before they can deal damage to you,
            unless they have an effect that would circumvent this. Incapacitated
            or dead enemies absorb no more damage, but work as 2d6 cover
            instead. If your cover saves you from being shot, an incapacitated
            human shield takes the full damage.
          </li>
          <li>
            You may try to disarm them, which is a contested Strength check. On
            a success, you may choose to either grab their weapon for yourself,
            or drop it onto the ground / throw it up to 5 + Strength distances
            away. When throwing it, roll Dexterity. On a success, it lands where
            you wanted it to. On a fail, roll a 1d[distance thrown] − 1. The
            result is where it lands instead.
          </li>
        </ul>
      </RulesSection>

      <RulesSection id="altitude" title="Altitude and flying">
        <p>
          Some characters can fly for one reason or another. When they start
          flying, their positions are determined through "altitude" units. This
          effectively turns the 1D field into a 2D field.
        </p>
        <p>
          Someone can occupy, for example, distance 5 and altitude 3, meaning
          they occupy distance 5 and are at altitude 3.
        </p>
        <p>
          Everyone is at altitude 0 by default, and this does not change unless
          they can get off the ground somehow. You need to occupy the same
          distance and altitude in order to attack someone in melee.
        </p>
        <p>
          When falling, you fall 1 altitude at first, increasing by 1 with every
          subsequent turn of falling.
        </p>
        <p>
          Once you hit the ground — reaching altitude 0 — you take [speed] × 3
          damage.
        </p>
      </RulesSection>

      <RulesSection id="armor" title="Armor">
        <p>Armor has five categories:</p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            <strong>None:</strong>{" "}
            the target has no armor at all. Any and all attacks do their regular
            damage.
          </li>
          <li>
            <strong>Personal:</strong>{" "}
            personal armor with middling effects. Each piece of personal armor
            has its unique characteristics.
          </li>
          <li>
            <strong>Light:</strong>{" "}
            can only be pierced by weapons with light armor piercing or higher.
            Immune to weapons with lower armor piercing.
          </li>
          <li>
            <strong>Medium:</strong>{" "}
            can only be pierced by weapons with medium armor piercing or higher.
            Immune to weapons with lower armor piercing.
          </li>
          <li>
            <strong>Heavy:</strong>{" "}
            can only be pierced by weapons with heavy armor piercing or higher.
            Immune to weapons with lower armor piercing.
          </li>
        </ul>
        <p>Melee attacks cannot damage light armor or above.</p>
      </RulesSection>

      <RulesSection id="visibility" title="Darkness, fog, and smoke">
        <p>
          If you cannot see a target directly due to darkness, fog, or smoke,
          but you know they are there, you may roll to attack, but may only roll
          1 die, and only obtain success on a 6 or higher.
        </p>
      </RulesSection>
    </WikiRulesLayout>
  );
});
