# RFC SOP

We directly use a subdirectory under [MetaGPT-docs](https://github.com/geekan/MetaGPT-docs) as the management repository for the RFC collection. The corresponding directory structure is

```text
MetaGPT-docs
├── readme.md
├── src
│    ├── public
│    │    ├── image
│    │    │    ├── rfcs
│    │    │    │    ├── 001           # rfc number, to store figures and so on
│    │    │    │    └── 002
│    ├── rfcs
│    │    ├── 001_20241010_agent_communication.md
│    │    └── 000_yyyymmdd_rfc_template.md  # RFC writing template, named with number_submission-date_title
```

## Learn about RFC SOP

### RFC Scope

RFC is a change request, which is mainly used to describe new features or important functional updates of `MetaGPT`. It is output through `markdown` and stored in `MetaGPT-docs` to record the historical implementation functions of `MetaGPT`. Through these design document outputs and communication feedback, let the `MetaGPT` community participate.  
The primary audience of RFC is the `MetaGPT` development community, which serves as a guide for functional design during development. The secondary audience is general users and developers who are interested in the starting point and implementation process of functional design.

#### When to write an RFC

As mentioned above, it is recommended to write an RFC in the following cases

- When you see a feature to be implemented in the roadmap and want to make a functional design description for the feature implementation
- When you have a better understanding of `MetaGPT` and want to add some new features and explain your ideas
- When you have a better understanding of `MetaGPT` and found some changes and upgrades that are worth a larger scale of refactoring

### Who is involved

#### Creator

The creator is the creator and main writer and maintainer of the RFC document. The creator outputs and updates the RFC template according to the expected functions. In the process, the creator updates the RFC according to the community feedback.

#### Sponsor

The sponsor is the main maintainer of the project, acting as a bridge between the creator and the review committee, and conducting relevant review organization work.

Generally, the sponsor can also be the creator.

#### Community staff

Comment on the RFC document, including differences in design ideas, whether it meets the requirements, etc. The comments of community staff should be related to the RFC theme and give effective suggestions on the RFC content objectively.

#### Review Committee

The main maintainers of `MetaGPT` are composed of several core contributors in the community. Responsible for deciding whether to approve the RFC.

- If there is a conflict in the document number, the review committee will come forward to coordinate and resolve it
- If there is a major dispute in the function design, the review committee will convene relevant personnel to discuss and determine the final conclusion

## RFC merge process

We follow the following process to manage RFCs

- The creator can choose one of the core contributors of the project as the sponsor

If the corresponding sponsor is not found within 2 weeks after the PR is released, the corresponding PR will be closed

- Create your RFC request by using [fork and pull request](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project)

Refer to [RFC template](https://github.com/geekan/MetaGPT-docs/src/en/guide/contribution/xxx_yyyymmdd_rfc_template.md) and name the RFC file according to `xxx_yyyymmdd_rfc_title` (number_date_RFC title, xxx is the maximum number of the currently merged RFC + 1, yyyymmdd is the submission date, rfc_title is the rfc title, which should be as concise and short as possible). For example, if your RFC title is agent_communication, you can name it `001_20241010_agent_communication`. When you need to introduce images and other materials in the file, place them in the `src/public/image/rfcs/001` subfolder (001 is your RFC number).

Fill in the basic information including creator, sponsor, update date, etc. in the front of the RFC file.

- After the RFC PR is released, the sponsor needs to organize a relevant review meeting within **two weeks** to discuss the design and determine whether to merge it. If no consensus is reached, the creator needs to further explain the existing problems, and the sponsor determines the next review time (usually within **one week**).
- PRs that do not meet the standards or fail the review will be required to be modified or rejected, and passed PRs will be promoted in the community.

## Maintain high standards

RFC writing is not easy, we encourage and welcome contributors to write according to this standard. But at the same time we should ensure quality with a high standard.
When encountering the following situations, the RFC document needs to be extensively modified or rejected.

- No sponsor organizes the corresponding review meeting
- Failure to reach a consensus on the design ideas during the review period
- Refusing to accept feedback generated during the review stage (including but not limited to compatibility, impact resolution, etc.)

The RFC review process and the code review process are carried out independently. We will try our best to discuss it clearly in the design stage to reduce conflicts in the implementation process.

## Acknowledgements

This RFC SOP refers to the design of [tensorflow rfcs](https://github.com/tensorflow/community/tree/master/rfcs) to a certain extent, and we would like to express our gratitude.
