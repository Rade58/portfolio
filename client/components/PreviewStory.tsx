/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import { FunctionComponent, useEffect, createRef } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { TweenMax, Power3 } from "gsap";
import { useService } from "@xstate/react";

import {
  storyService,
  fse,
  fseS,
  EEs,
  EE,
} from "../state_machines/story_machine";

import { currentMajor } from "../content";

import { fse as majorFse } from "../sketch/middle_ground/major_states";

import {
  upDownArrowHeight as bottomMargin,
  previewHeight,
  previewMargin,
  matchMediaMaxWidth,
  aboveMediaArticleMargin,
} from "../css_vars";

import { SanityDataI } from "../sanity/data_types";

interface PropsStoryI {
  data: SanityDataI;
}

const PreviewStory: FunctionComponent<PropsStoryI> = ({ data }) => {
  const [state, send] = useService(storyService);

  const tekstRef = createRef<HTMLDivElement>();
  const previewRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (
      state.event.type === EE.DISABLE_OUTLINE ||
      state.event.type === EE.ENABLE_OUTLINE
    ) {
      return;
    }

    if (tekstRef.current && previewRef.current) {
      // console.log(state.value);

      if (state.value[fse.idle] && state.value[fse.idle] === fseS.partial) {
        TweenMax.fromTo(
          tekstRef.current,
          {
            // delay: 0.4,
            opacity: 0,
            height: 0,
            duration: 0.08,
            ease: Power3.easeIn,
          },
          {
            opacity: 1,
            height: "28px",
            // delay: 0.4,
          }
        );
        // ----------------------------------------------
        TweenMax.fromTo(
          previewRef.current,
          {
            // delay: 0.4,

            height: 0,
            marginBottom: 0,
            duration: 0.08,
            ease: Power3.easeIn,
          },
          {
            height: previewHeight,
            marginBottom: bottomMargin,
            // delay: 0.4,
          }
        );
      }
      //  -------- <><><><><><><><><><><><><><><><><> --------
      if (state.value[fse.idle] && state.value[fse.idle] === fseS.maximal) {
        if (
          state.event.type !== EEs.ARROW_UP_PUSHED &&
          state.event.type !== EEs.ARROW_UP_TRANS
        ) {
          TweenMax.fromTo(
            tekstRef.current,
            {
              opacity: 1,
              height: "28px",
              top: 0,
              duration: 0.08,
              ease: Power3.easeIn,
            },
            {
              opacity: 0,
              top: 28,
              height: "0px",
            }
          );

          // ----------------------------------------------
          TweenMax.fromTo(
            previewRef.current,
            {
              height: previewHeight,
              marginBottom: bottomMargin,
              duration: 0.08,
              ease: Power3.easeIn,
            },
            {
              height: 0,
              marginBottom: 0,
            }
          );
        }
      }
    }
  }, [state]);

  const { mediaBellow } = state.context;

  let height = "0px";
  let margin = "0px";

  if (!mediaBellow) {
    height = "0px";
    margin = "0px";
  } else {
    if (state.value && state.value[fse.idle]) {
      if (state.value[fse.idle] === fseS.partial) {
        height = previewHeight;
        margin = previewMargin;
      }

      if (state.value[fse.idle] === fseS.maximal) {
        height = "0px";
        margin = "0px";
      }
    }
  }

  return (
    <div
      style={{
        // ovo je problem
        height,
        marginBottom: !mediaBellow ? aboveMediaArticleMargin : margin,
      }}
      ref={previewRef}
      className="preview"
      css={css`
        box-sizing: border-box;

        border: pink solid 0px;
        position: relative;
        padding-left: 18px;
        padding-bottom: 0px;

        & .tekst {
          height: 28px;
          padding-bottom: 0px;

          & .three-dots {
            color: crimson;
            font-size: 1.2rem;
          }
        }
      `}
    >
      {state && state.context && state.context.mediaBellow && state.value && (
        <div className="tekst" ref={tekstRef}>
          {/* {state.context.major !== "undefined" &&
            storyPreview(state.context.major)} */}
          {state.context.major !== "undefined" &&
            data[state.context.major] &&
            data[state.context.major].previewText}
          <span className="three-dots"> ...</span>
        </div>
      )}
    </div>
  );
};

export default PreviewStory;
