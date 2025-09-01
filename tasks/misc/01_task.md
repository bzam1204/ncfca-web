<task>fix hook return entity and fix return dtos from hook, action and gateway></task>

<techspec>
- the src/hooks/use-manage-dependants.ts:17 must return an new entity, but it is returning the anemic objetc, not an entity. the entity @domain/entities/dependant.entity.ts
- to better represent the data, I created in @contracts/api/dependant.dto.ts, the DependantDto, which is the dto that should be returned from the action and gateway (because they only can return plain objects, not rich entities with methods).
- action (src/infraestructure/actions/get-dependants.action.ts:9) must use the dependant dto/
</techspec>

<critical>
**FOLLOW PROJECT'S RULES**: @.cursor/rules/*.mdc
**FOCUS ON YOUR TASK**
</critical>