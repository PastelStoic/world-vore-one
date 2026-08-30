import { define } from "@/utils.ts";
import {
  RulesCallout,
  RulesSection,
  RulesToc,
  WikiRulesLayout,
} from "@/components/WikiRulesLayout.tsx";

export default define.page(function WikiRulesVehicles() {
  return (
    <WikiRulesLayout
      title="Vehicles"
      description="Ground vehicles, crew roles, fighting in and against vehicles, airplanes, and ships."
      currentHref="/wiki/rules/vehicles"
    >
      <RulesToc
        items={[
          { id: "stats", label: "Vehicle stats" },
          { id: "fighting", label: "Fighting a vehicle" },
          { id: "manning", label: "Manning a vehicle" },
          { id: "inside", label: "Fighting while inside" },
          { id: "airplanes", label: "Airplanes" },
          { id: "ships", label: "Ships and boats" },
        ]}
      />

      <p class="text-base-content">
        Vehicle statistics, crew lists, armor, and modules are catalogued in the
        {" "}
        <a href="/wiki/vehicles" class="text-primary hover:underline">
          vehicles wiki
        </a>
        . This page covers how vehicles work in play.
      </p>

      <RulesSection id="stats" title="Vehicle stats">
        <p>
          Vehicles work similarly to regular player characters. They have HP,
          speed, agility, and only occupy 1 distance regardless of size.
        </p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            <strong>HP</strong>{" "}
            is how much punishment they can take before they are out of combat.
            Once HP hits 0, the vehicle is disabled and can no longer move; its
            speed is fixed to 0, but its weapons still function. Once HP hits
            its full negative, the vehicle's hull is entirely destroyed — crew
            is exposed and it now becomes cover. None of its weapons may be
            used.
          </li>
          <li>
            <strong>Speed</strong>{" "}
            is how many distances they can move in one turn.
          </li>
          <li>
            <strong>Agility</strong>{" "}
            is how much movement must be spent to turn it. If your speed is 3
            and your agility is 2, you can move forward 1 distance, then spend 2
            of your movement points to turn the vehicle one facing.
          </li>
          <li>
            <strong>Size</strong>{" "}
            represents how much space they take up inside a stomach. By default
            you can only carry 2 people inside your stomach, so any vehicle a
            size bigger than 2 cannot be eaten. A vehicle can only be eaten if
            its weapons and engine are no longer working; otherwise they would
            escape or shoot you from within. In that condition, a vehicle cannot
            resist being eaten — you still need to grapple it and swallow it as
            if it were a regular character. The vehicle's size is also its
            weight for encumbrance purposes.
          </li>
        </ul>
        <p>
          You cannot digest a vehicle unless you have the Living Furnace perk.
          In that case, the vehicle's size also represents its digestion
          resilience.
        </p>
        <p>
          Vehicles cannot run people over in combat. They can do it as an
          ambush, dealing as much damage as the vehicle's speed times its seats
          (speed × seats).
        </p>
      </RulesSection>

      <RulesSection id="fighting" title="Fighting a vehicle">
        <p>
          Vehicles have armor, and their armor can only be pierced by a weapon
          that has the adequate armor piercing stat. Armor ranges from light,
          medium, and heavy. A vehicle has 4 facings — its front, its sides, and
          its rear. Depending on which is facing the enemy, that is the one they
          will have to pierce through.
        </p>
        <p>
          You cannot damage a vehicle if its armor rating is higher than your
          weapon's armor piercing value. You can pierce values equal or lower
          than your armor piercing value.
        </p>
        <p>
          A vehicle has modules and crew, which can be internal or external.
          Damage dealt to a module also directly deals damage to the vehicle,
          but not the other way around.
        </p>
        <p>
          Crew can also be targeted, and damage dealt to crew is also dealt to
          the vehicle, as you would still be piercing the vehicle.
        </p>
        <p>
          If a module hits 0 HP, it stops functioning until repaired. Every time
          a module is hit thereafter, it will stop functioning again until
          repaired once more. If a module hits its full negative HP, it is
          entirely destroyed and cannot be repaired.
        </p>
        <p>
          When attacking a vehicle, you can simply deal damage to its HP, or
          target a module or crew. Each module or crew has a difficulty rating,
          which requires more successes in order to be hit, depending on facing.
          Even if targeting a module or crew, getting a single success over the
          vehicle's cover will still deal damage to the vehicle; it simply will
          not damage the targeted module.
        </p>
        <p>
          Explosions inside the vehicle damage all of its internal modules and
          crew equally.
        </p>
        <p>
          If you are within distance 0 of a vehicle, you can exploit its gaps
          and holes — you can push grenades inside it as a Dexterity check.
          Failure drops it on your feet, exploding on your next turn.
        </p>
      </RulesSection>

      <RulesSection id="manning" title="Manning a vehicle">
        <p>
          It takes one action to enter or leave the vehicle. You may take any
          available seat immediately. Up to [doors] number of people can enter
          or leave a vehicle in a turn. A vehicle that has its doors open can be
          shot in or out of, even if the enemy is at distance 0.
        </p>
        <p>
          It takes one action to swap seats. If there is a dead teammate sitting
          on it, an action must be spent pulling them out of there before the
          seat can be occupied.
        </p>
        <p>
          There are many roles within a vehicle. Most are self-explanatory, but
          two in particular require explanations.
        </p>

        <h3 class="text-lg font-semibold pt-2">Commander</h3>
        <p>
          The commander is required for the functioning of certain vehicles.
          With the commander dead or gone, there is no coordination between the
          members of the vehicle.
        </p>
        <p>Without a commander:</p>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            Every action taken inside the vehicle takes a −3d6 to be performed.
          </li>
          <li>
            The roleplayers may not use out-of-character discussion or other
            means to decide what to do. Each must act on their own turns; they
            cannot communicate their intentions to one another.
          </li>
          <li>
            The vehicle is blind and cannot clearly see enemies approaching,
            making it automatically fail at spotting ambushes, traps, and hiding
            enemies.
          </li>
        </ul>
        <p>
          The lack of a commander being listed in a vehicle's sheet implies that
          the vehicle does not need one to be operated properly, such as a car,
          truck, or motorcycle.
        </p>

        <h3 class="text-lg font-semibold pt-2">Engineer</h3>
        <p>
          The engineer is required to make sure the unwieldy machines keep
          working properly. An engineer can repair one internal module per turn.
          This is an Intelligence check, requiring 1 + (how negative the
          module's HP is) / 2 successes, rounded down. Without an engineer,
          malfunctions cannot be repaired. They do not heal the module; rather,
          they just make it work again.
        </p>
        <p>
          The lack of an engineer being listed in a vehicle's seat implies you
          cannot repair the vehicle's internal modules from within the vehicle
          itself. You would have to go outside to do so. For a car, for example,
          you would have to get out to fix the engine or wheels.
        </p>
        <p>
          A vehicle has many seats and roles. In order to fulfill a role, you
          must also occupy its seat: a gunner needs the gunner's seat, a
          commander the commander's seat, an engineer the engineer's seat.
        </p>
        <p>
          If your engineer dies, you must pull them out of their seat, then
          occupy it, before you can start doing any repairs. Likewise, if the
          commander is gone, they must be taken out of their seat, then have it
          occupied by a live member, so as to command the vehicle while they are
          away.
        </p>
        <p>
          Two crewmembers can swap seats if they hold their actions to do so at
          the same time.
        </p>
      </RulesSection>

      <RulesSection id="inside" title="Fighting while inside">
        <p>
          A vehicle has five phases, which are always done in this order,
          without exception:
        </p>
        <ol class="list-decimal pl-6 space-y-1">
          <li>Commands given by the commander, if any.</li>
          <li>Movement by the driver.</li>
          <li>Shooting by the gunners and crew.</li>
          <li>Repairs by the engineer, if any.</li>
          <li>
            Miscellaneous crew does things (passengers enter or leave, shoot out
            of the vehicle, equip something, and so on).
          </li>
        </ol>
        <p>
          A vehicle's initiative is decided by the commander's Charisma. If the
          vehicle has no commander, it is then decided by the driver's
          Dexterity. If a vehicle has neither, it goes to the bottom of
          initiative. A vehicle keeps its starting initiative even if its crew
          dies, so as to avoid rearranging initiatives mid-combat.
        </p>
        <p>
          The crew of a vehicle no longer have individual initiatives. They act
          when it is the vehicle's turn, in the order described above.
        </p>
        <p>
          Vehicles are tight and cramped. Two-handed weapons cannot be used
          inside.
        </p>
        <p>
          Shooting while the vehicle is moving is extremely difficult. Any
          attempt by the gunners or crew to shoot immediately defaults to a
          single 1d6, which succeeds on a 5 or a 6. Perks do not change this. A
          weapon's rate of fire is the only way to increase the dice pool, using
          the standard rate-of-fire rules. If the vehicle is entirely still,
          there are no penalties.
        </p>
        <p>
          Using the vehicle's weapons follows the same rules as operating any
          other weapon.
        </p>
        <p>
          Vehicles have facings: front, sides, and rear. Vehicles can only go
          back and forward, so if a vehicle is on its side, you have to turn
          before you can start moving.
        </p>
        <p>
          Any vehicle can only reverse 1 distance per turn, unless stated
          otherwise. Forward movement is stated in each vehicle's description.
        </p>
        <p>
          A vehicle cannot attack targets in distance 0. They are too close for
          your weapons to be effective.
        </p>
      </RulesSection>

      <RulesSection id="airplanes" title="Airplanes">
        <p>
          By virtue of flying, planes enforce that the battle becomes a 2D field
          instead of the typical 1D. How high something is is described as
          altitude. One could be, for example, in distance 5, altitude 13.
        </p>
        <p>
          Planes have a maximum and a minimum speed threshold. If they are below
          the minimum, they immediately start falling. A plane starts falling by
          1 altitude per turn, increasing by 1 altitude for every subsequent
          turn. The plane's nose is also considered to be pointing down once it
          begins to fall.
        </p>
        <p>
          A plane falling and crashing is completely destroyed and its pilot
          dies, no matter how small of a fall it was.
        </p>
        <p>
          It does not take an action to move a plane — they are always moving
          forward. It takes an action to switch their speed.
        </p>
        <p>
          Planes can only go up or down 1 speed per action, unless stated
          otherwise.
        </p>
        <p>
          If the engine is not working for whatever reason, the plane loses 1
          speed per turn, until it hits 0.
        </p>
        <p>
          Airplanes have 6d6 cover naturally for as long as they are moving,
          gaining +2d6 for every distance they have moved that turn. They can be
          targeted by small arms; however, any such attacks immediately default
          to a 1d6, with successes on a 5 or a 6. Perks do not affect this. A
          weapon's rate of fire can increase the dice pool, obeying typical
          rate-of-fire rules.
        </p>
      </RulesSection>

      <RulesSection id="ships" title="Ships and boats">
        <p>
          Boats work exactly like ground vehicles, but only move in the water.
          The same rules that apply for ground vehicles also apply to boats.
        </p>
        <p>Ships, however, are an entirely different can of worms.</p>
        <p>
          Ships, in spite of being realistically immune to practically every
          light artillery cannon in real life by virtue of their heavy armor,
          are not immune in this system. Sufficient artillery, even if light,
          can sink them.
        </p>
        <p>
          The issue arises in sinking the thing, because ships have a lot of HP.
          It will never be cost-effective to destroy ships while using light
          artillery and whatnot.
        </p>
        <p>
          Ships fight from extremely far distances, to the point that measuring
          them would be moot. Instead, ships have detection and stealth stats,
          which allow them to spot enemy ships and try to attack them, with
          varying degrees of prediction.
        </p>
        <p>
          Ships also cannot be manned by single persons, requiring instead
          massive crews and coordinated efforts to manage. Ships require
          spotters, signalers, captains, coordinators, gunners, sailors, and
          much more.
        </p>
        <RulesCallout>
          <p>
            Ships remain a work in progress. They are simply too huge to be
            treated as pieces on a battlefield. They will be handled as scenes
            demand them.
          </p>
        </RulesCallout>
      </RulesSection>
    </WikiRulesLayout>
  );
});
