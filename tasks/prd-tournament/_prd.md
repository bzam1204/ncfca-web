<task>

# Create Tournament's Page

</task>
<introduction>

## Introduction

The backend for tournament's page is done. the routes are implemented and you can see on @openapi.json.

What we need is to have the following screens:

- <panel-page>tournament's panel page;</panel-page>
- <individual-page>tournament's individual page;</individual-page>

</introduction>

<critical>

## Critical

**USE THE PROJECT'S RULES**: @rules/*.mdc;

**FOLLOW THE API STANDARDIZATION**: the <api-std>@rules/api-layer-standardization.md</api-std>

**USE CONTEXT7**: USE CONTEXT7 MCP TO GET OFICIAL DOCUMENTATION FOR THE DEPENDENCIES.

**USE SHADCN**: USE SHADCN UI TO CREATE THE PAGES.

</critical>

<panel-page>

<to-be>

## To-Be

### Panel Page
    
**can be similar to @src/app/dashboard/clubs/page.tsx**

*should have*:

- (tab1) explore tournaments: 
    - a tournament's card carrousel to promote desired events; you'll notice that the endpoint does not exists. What I expect you'd do is follow the <api-std>, but mock it at the gateway implementation route and put a todo to specify what the front expects from the backend. when we click on the carrousel card, we must go to the tournament's individual page.
    - a grid card showing all tournaments with filters and pagination an a cta to open the tournament page and register.
- (tab2) my registrations: a table with my registrations of all statuses; 

</panel-page>
<individual-page>

### Individual Page

Should show the tournament's info.

- Present all the data from the api.
- Present also the number of registrations and (not presented in the api, create a todo and mock that specific property in the gateway implementation)
and a cta to register.

#### Registrations

##### Individual Registration 

- The individual registration must be a dialog (similar to request club enrollment) which the holder will select the dependant and register him in the tournament. 
- The user wil receive a toast message with the result (use notify)

##### Duo Registration 

<reference>
<change-principal-dialog>@src/app/(admin)/admin/dashboard/clubs/[clubId]/_components/change-principal-dialog.tsx</change-principal-dialog>
<query-keys>@src/infrastructure/cache/query-keys.ts</query-keys>
<next-keys>@src/infrastructure/cache/next-keys.ts</next-keys>
</reference>

- The Duo Registration should be a dialog - `similar to <change-principal-dialog>` - that the holder will select his dependant and search the email of the partner in the field and the system will show if there is a match or not `only by email`, similar to `<change-principal-dialog>` process. then it will select the partner, if it was found and submit. if not, a not found message must appear. 
- finnaly, the toast must appear with the result. and the ui must react. 

<cache>

##### Cache

- QueryKeys: for each mutation above, we must revalidate the relative keys. see <query-keys> and think about the cache strategy;
- NextKeys: for each fetch on the gateway implementation, we must add our keys (tags for nextjs) and think about a cache strategy
</cache>

</individual-page>

</to-be>